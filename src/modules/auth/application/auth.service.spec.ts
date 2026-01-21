import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/application/user.service';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailVo } from '../../user/domain/value-objects/email.vo';
import { User } from '../../user/domain/entities/user.entity';
import { UserStatusEnum } from '../../user/domain/enums/user-status.enum';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: 'PasswordHasher', useValue: passwordHasherMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const userServiceMock = {
    findByEmailForAuth: jest.fn(),
  };

  const passwordHasherMock = {
    compare: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  it('should authenticate user and return token', async () => {
    const user = User.restore({
      id: 1,
      name: 'Pedro',
      email: new EmailVo('pedro@gmail.com'),
      password: '12345678',
      status: UserStatusEnum.ACTIVE,
    });

    userServiceMock.findByEmailForAuth.mockResolvedValue(user);
    passwordHasherMock.compare.mockResolvedValue(true);
    jwtServiceMock.signAsync.mockResolvedValue('fake-jwt');

    const result = await service.signIn('pedro@gmail.com', '123456');

    expect(userServiceMock.findByEmailForAuth).toHaveBeenCalledWith(
      'pedro@gmail.com',
    );
    expect(passwordHasherMock.compare).toHaveBeenCalled();
    expect(jwtServiceMock.signAsync).toHaveBeenCalled();

    expect(result).toEqual({
      user: {
        id: 1,
        name: 'Pedro',
        email: 'pedro@gmail.com',
        status: UserStatusEnum.ACTIVE,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      access_token: 'fake-jwt',
    });
  });

  it('should throw UnauthorizedException if user not found', async () => {
    userServiceMock.findByEmailForAuth.mockResolvedValue(undefined);

    await expect(
      service.signIn('notfound@email.com', '123456'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    userServiceMock.findByEmailForAuth.mockResolvedValue(undefined);

    await expect(
      service.signIn('notfound@email.com', '123456'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const user = User.restore({
      id: 1,
      name: 'Pedro',
      email: new EmailVo('pedro@email.com'),
      password: 'hashed-password',
      status: UserStatusEnum.ACTIVE,
    });

    userServiceMock.findByEmailForAuth.mockResolvedValue(user);
    passwordHasherMock.compare.mockResolvedValue(false);

    await expect(
      service.signIn('pedro@email.com', 'wrong-pass'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should not expose password', async () => {
    const user = User.restore({
      id: 1,
      name: 'Pedro',
      email: new EmailVo('pedro@email.com'),
      password: 'hashed-password',
      status: UserStatusEnum.ACTIVE,
    });

    userServiceMock.findByEmailForAuth.mockResolvedValue(user);
    passwordHasherMock.compare.mockResolvedValue(true);
    jwtServiceMock.signAsync.mockResolvedValue('fake-jwt');

    const result = await service.signIn('pedro@email.com', '123456');

    expect(result.user).not.toHaveProperty('password');
  });
});
