import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import { UserService } from './user.service';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { EmailVo } from '../domain/value-objects/email.vo';
import { User } from '../domain/entities/user.entity';
import { UserStatusEnum } from '../domain/enums/user-status.enum';
import { PasswordHasher } from '../../../lib/cryptography/password-hasher.interface';

const userRepositoryMock: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByEmailForAuth: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const passwordHasherMock: jest.Mocked<PasswordHasher> = {
  hash: jest.fn(),
  compare: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: userRepositoryMock,
        },
        {
          provide: 'PasswordHasher',
          useValue: passwordHasherMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user when email does not exist', async () => {
    // arrange
    userRepositoryMock.findByEmail.mockResolvedValue(null);

    const user = User.restore({
      id: 1,
      name: 'Pedro',
      email: new EmailVo('pedro@email.com'),
      password: 'hashed-password',
      status: UserStatusEnum.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    userRepositoryMock.create.mockResolvedValue(user);

    // act
    const result = await service.create({
      name: 'Pedro',
      email: 'pedro@email.com',
      password: '12345678',
    });

    // assert
    expect(userRepositoryMock.findByEmail).toHaveBeenCalled();
    expect(userRepositoryMock.create).toHaveBeenCalled();
    expect(result.email).toBe('pedro@email.com');
  });

  it('should throw ConflictException when email already exists', async () => {
    // arrange
    const existingUser = User.restore({
      id: 1,
      name: 'Pedro',
      email: new EmailVo('pedro@email.com'),
      password: 'hashed-password',
      status: UserStatusEnum.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    userRepositoryMock.findByEmail.mockResolvedValue(existingUser);

    // act & assert
    await expect(
      service.create({
        name: 'Pedro',
        email: 'pedro@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
