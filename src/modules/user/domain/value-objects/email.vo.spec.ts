import { EmailVo } from './email.vo';

describe('Email Value Object', () => {
  const makeEmail = () => new EmailVo('pedro@email.com');

  it('should create a valid email', () => {
    expect(makeEmail().getValue()).toBe('pedro@email.com');
  });

  it('should getValue() return string', () => {
    expect(typeof makeEmail().getValue()).toBe('string');
  });

  it.each([
    'pedro#email.com',
    'pedro@email',
    'pedro @email.com',
    'pedro@email.',
    '',
  ])('should throw for invalid email: %s', (email) => {
    expect(() => new EmailVo(email)).toThrow();
  });

  it('should trim recived value', () => {
    const email = new EmailVo('    pedro@gmail.com  ');
    expect(email.getValue()).toBe('pedro@gmail.com');
  });

  it('should parse to lowercase recived value', () => {
    const email = new EmailVo('PEDRO@GMAIL.COM');
    expect(email.getValue()).toBe('pedro@gmail.com');
  });
});
