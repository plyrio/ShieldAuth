import { AuthDto } from './signIn.dto';

describe('AuthDto', () => {
  it('should be defined', () => {
    expect(new AuthDto()).toBeDefined();
  });
});
