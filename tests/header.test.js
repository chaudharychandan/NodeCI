const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

test('The header has the correct text', async () => {
  const logoSelector = 'a.brand-logo';
  const text = await page.getContentsOf(logoSelector);
  expect(text).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
  const logoutBtnSelector = 'a[href="/auth/logout"]';
  await page.login();
  const logoutText = await page.getContentsOf(logoutBtnSelector);

  expect(logoutText).toEqual('Logout');
});

afterEach(async () => {
  await page.close();
});
