import { SaffronPage } from './app.po';

describe('saffron App', () => {
  let page: SaffronPage;

  beforeEach(() => {
    page = new SaffronPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
