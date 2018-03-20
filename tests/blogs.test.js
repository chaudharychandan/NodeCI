const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

describe('When logged in', async () => {
  const createBlogSubmitFormBtnSelector = 'form button[type="submit"]';
  beforeEach(async () => {
    const createBlogBtnSelector = 'a[href="/blogs/new"]';
    await page.login();
    await page.click(createBlogBtnSelector);
  });

  test('can see blog create form', async () => {
    const title = 'Blog Title';
    const labelSelector = 'form label';
    const label = await page.getContentsOf(labelSelector  );

    expect(label).toEqual(title);
  });

  describe('and using valid inputs', async () => {
    const newTitle = 'My title';
    const newContent = 'My content';

    beforeEach(async () => {
      const titleInputSelector = 'form .title input';
      const contentInputSelector = 'form .content input';
      await page.type(titleInputSelector, newTitle);
      await page.type(contentInputSelector, newContent);
      await page.click(createBlogSubmitFormBtnSelector);
    });

    test('submitting takes user to  review screen', async () => {
      const message = 'Please confirm your entries';
      const confirmMessageSelector = 'form h5';
      const confirmMessage = await page.getContentsOf(confirmMessageSelector);

      expect(confirmMessage).toEqual(message);
    });

    test('submitting then saving adds blog to index page', async () => {
      const nextBtnSelector = 'form button.green';
      await page.click(nextBtnSelector);

      await page.waitFor('.card');

      const title = await page.getContentsOf('.card .card-content .card-title');
      const content = await page.getContentsOf('.card .card-content p');
      expect(title).toEqual(newTitle);
      expect(content).toEqual(newContent);
    });
  });

  describe('and using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click(createBlogSubmitFormBtnSelector);
    });

    test('the form shows the error message', async () => {
      const error = 'You must provide a value';
      const titleErrorSelector = 'form .title .red-text';
      const contentErrorSelector = 'form .content .red-text';
      const titleErrorMessage = await page.getContentsOf(titleErrorSelector);
      const contentErrorMessage = await page.getContentsOf(contentErrorSelector);

      expect(titleErrorMessage).toEqual(error);
      expect(contentErrorMessage).toEqual(error);
    });
  });
});

describe('When user is not logged in', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'My Title',
        content: 'My Content'
      }
    }
  ];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequest(actions);

    for (result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});

afterEach(async () => {
  await page.close();
});
