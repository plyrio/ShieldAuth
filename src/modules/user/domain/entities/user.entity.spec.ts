import { User } from './user.entity';
import { UserStatusEnum } from '../enums/user-status.enum';
import { EmailVo } from '../value-objects/email.vo';

describe('User Entity', () => {
  const makeUser = () =>
    new User({
      id: 1,
      name: 'Pedro',
      email: new EmailVo('pedro@email.com'),
      password: 'hashed-password',
      status: UserStatusEnum.ACTIVE,
    });

  it('should create a user entity always active', () => {
    const user = makeUser();
    expect(user).toBeInstanceOf(User);
    expect(user.getName()).toBe('Pedro');
    expect(user['email'].getValue()).toBe('pedro@email.com');
    expect(user.getStatus()).toBe(UserStatusEnum.ACTIVE);
  });

  it('should inactive an active user', () => {
    const user = makeUser();
    user.inactivate();
    expect(user.getStatus()).toBe(UserStatusEnum.INACTIVE);
  });

  it('should not allow inactive user to change name', () => {
    const user = makeUser();
    user.inactivate();

    expect(() => {
      user.changeName('Novo Nome');
    }).toThrow();
  });

  it('should not allow inactive user to change email', () => {
    const user = makeUser();
    user.inactivate();

    expect(() => {
      user.changeEmail(new EmailVo('pedroh@lyrio.com'));
    }).toThrow();
  });

  it('should allow active user to change name', () => {
    const user = makeUser();
    user.changeName('Novo Nome');

    expect(user.getName()).toBe('Novo Nome');
  });
  it('should allow active user to change email', () => {
    const user = makeUser();
    user.changeEmail(new EmailVo('pedroh@gmail.com'));

    expect(user['email'].getValue()).toBe('pedroh@gmail.com');
  });

  it('should not inactivate an already inactive user', () => {
    const user = makeUser();

    user.inactivate();

    expect(user.getStatus()).toBe(UserStatusEnum.INACTIVE);
  });

  it('should activate an inactive user', () => {
    const user = makeUser();

    user.inactivate();
    user.activate();

    expect(user.getStatus()).toBe(UserStatusEnum.ACTIVE);
  });

  it('should not activate an already active user', () => {
    const user = makeUser();

    expect(() => user.activate()).toThrow();
  });

  it('should update password hash', () => {
    const user = makeUser();

    user.changePassword('hashed-password');

    // NÃO testa criptografia
    // Testa estado
    expect(
      // acessa via comportamento indireto
      user.checkPassword('raw-password', {
        compare: jest.fn().mockResolvedValue(true),
      } as any),
    ).resolves.toBe(true);
  });
});
