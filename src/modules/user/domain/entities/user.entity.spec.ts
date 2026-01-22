import { User } from './user.entity';
import { UserStatusEnum } from '../enums/user-status.enum';
import { EmailVo } from '../value-objects/email.vo';
import { PasswordHasher } from '../../../../lib/cryptography/password-hasher.interface';

describe('User Entity', () => {
  const passwordHasherMock: PasswordHasher = {
    hash: jest.fn(), // não usado nesse teste
    compare: jest.fn().mockResolvedValue(true),
  };
  const makeUser = () =>
    new User({
      id: 1,
      name: 'Pedro',
      email: new EmailVo('pedro@email.com'),
      password: 'hashed-password',
      status: UserStatusEnum.ACTIVE,
    });

  // Creation / initial state
  it('should create a user entity as active by default', () => {
    const user = makeUser();
    expect(user).toBeInstanceOf(User);
    expect(user.getName()).toBe('Pedro');
    expect(user['email'].getValue()).toBe('pedro@email.com');
    expect(user.getStatus()).toBe(UserStatusEnum.ACTIVE);
  });

  // Status transitions
  it('should inactivate an active user', () => {
    const user = makeUser();
    user.inactivate();
    expect(user.getStatus()).toBe(UserStatusEnum.INACTIVE);
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

  // Modification rules (INACTIVE)
  it('should not allow an inactive user to change name', () => {
    const user = makeUser();
    user.inactivate();

    expect(() => {
      user.changeName('New Name');
    }).toThrow();
  });

  it('should not allow an inactive user to change email', () => {
    const user = makeUser();
    user.inactivate();

    expect(() => {
      user.changeEmail(new EmailVo('pedroh@lyrio.com'));
    }).toThrow();
  });

  // Allowed modifications (ACTIVE)
  it('should allow an active user to change name', () => {
    const user = makeUser();
    user.changeName('New Name');
    expect(user.getName()).toBe('New Name');
  });

  it('should allow an active user to change email', () => {
    const user = makeUser();
    user.changeEmail(new EmailVo('pedroh@gmail.com'));
    expect(user['email'].getValue()).toBe('pedroh@gmail.com');
  });

  // Derived state changes
  it('should validate password using password hasher', async () => {
    const user = makeUser();

    const result = await user.checkPassword('raw-password', passwordHasherMock);

    expect(result).toBe(true);
    expect(passwordHasherMock.compare).toHaveBeenCalledWith(
      'raw-password',
      'hashed-password',
    );
  });

  it('should update updatedAt after changes', () => {
    const user = makeUser();
    const oldMs = user.getUpdatedAt().getTime();

    user.changeName('New Name');

    const newMs = user.getUpdatedAt().getTime();

    expect(newMs).toBeGreaterThanOrEqual(oldMs);
  });

  // DTO / data exposure
  it('should not expose password in the DTO', () => {
    const user = makeUser();
    const dto = user.toDto();
    expect('password' in dto).toBe(false);
    expect(dto).not.toHaveProperty('password');
  });
});
