import { User } from './user.entity.js';
import { UserStatusEnum } from './user-status.enum.js';
import { EmailVo } from './email.vo.js';

describe('User Entity', () => {
  const makeUser = () =>
    new User({
      id: 1,
      name: 'Pedro',
      email: new EmailVo('pedro@email.com'),
      passwordHash: 'hashed-password',
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
    }).toThrow('Inactive user cannot perform this action');
  });

  it('should not inactivate an already inactive user', () => {
    const user = makeUser();

    user.inactivate();

    expect(user.getStatus()).toBe(UserStatusEnum.INACTIVE);
  });
});
