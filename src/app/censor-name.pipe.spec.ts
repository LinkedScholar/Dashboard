import { CensorNamePipe } from './censor-name.pipe';

describe('CensorNamePipe', () => {
  it('create an instance', () => {
    const pipe = new CensorNamePipe();
    expect(pipe).toBeTruthy();
  });
});
