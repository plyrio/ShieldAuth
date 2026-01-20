import { EmailVo } from './email.vo';

describe('Email Value Object', () => {
  const makeEmail = () => new EmailVo('pedro@email.com');

  it('should create a valid email', () => {
    const emailValid = makeEmail();
    expect(emailValid).toBeInstanceOf(EmailVo);
    expect(emailValid.getValue()).toBe('pedro@email.com');
  });

  it('should not create email with invalid value', () => {
    expect(() => {
      new EmailVo('pedro#lyriobr.');
    }).toThrow();
  });
});
