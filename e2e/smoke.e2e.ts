import { test, expect } from '@playwright/test';

const LESSONS = [
  'what-is-an-artificial-neuron',
  'activation-functions',
  'forward-propagation',
  'loss-functions',
  'gradient-descent',
  'backpropagation-fundamentals',
  'convolutional-filters',
  'pooling-and-receptive-fields',
  'cnn-inference-pipeline',
  'regularization-dropout',
  'adaptive-optimizers',
];

const PAGES = ['/', '/learn', '/playground', '/practice', '/about'];

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, 'page should not scroll horizontally').toBeLessThanOrEqual(1);
}

for (const path of PAGES) {
  test(`page ${path} renders with one h1 and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}

for (const slug of LESSONS) {
  test.describe(`lesson ${slug}`, () => {
    test('loads, has no overflow, and sliders respond to the keyboard', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

      await page.goto(`/learn/${slug}`);
      await expect(page.locator('h1')).toHaveCount(1);
      await expectNoHorizontalOverflow(page);

      // Raw LaTeX must never leak into the page.
      const text = await page.locator('main').innerText();
      expect(text).not.toMatch(/\\(sum|hat|frac|sigma|partial)\b/);

      const slider = page.locator('input[type="range"]').first();
      if (await slider.count()) {
        await slider.scrollIntoViewIfNeeded();
        await slider.focus();
        const before = await slider.inputValue();
        await page.keyboard.press('End');
        const after = await slider.inputValue();
        expect(after).not.toBe(before);
      }
      expect(errors).toEqual([]);
    });

    test('respects prefers-reduced-motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`/learn/${slug}`);
      const durations = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>('*'))
          .map((el) => getComputedStyle(el).animationDuration)
          .filter((d) => d && d !== '0s'),
      );
      for (const d of durations) {
        expect(parseFloat(d)).toBeLessThan(0.05);
      }
    });
  });
}

test('unknown lesson renders the not-found page', async ({ page }) => {
  // Known issue: with cacheComponents the dynamic lesson route streams, so the
  // HTTP status is 200 even though the 404 UI renders. Assert on content for now.
  await page.goto('/learn/does-not-exist');
  await expect(page.getByText('Error 404')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Browse Curriculum' })).toBeVisible();
});
