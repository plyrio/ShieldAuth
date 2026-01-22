import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
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

  const makeUser = () =>
    User.restore({
      id: 1,
      name: 'Pedro',
      email: new EmailVo('pedro@email.com'),
      password: 'hashed-password',
      status: UserStatusEnum.ACTIVE,
    });

  it('should create a user when email does not exist', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    userRepositoryMock.create.mockResolvedValue(makeUser());
    passwordHasherMock.hash.mockResolvedValue('hashed-password');

    const result = await service.create({
      name: 'Pedro',
      email: 'pedro@email.com',
      password: '12345678',
    });

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      new EmailVo('pedro@email.com'),
    );
    expect(passwordHasherMock.hash).toHaveBeenCalled();
    expect(userRepositoryMock.create).toHaveBeenCalled();
    expect(result.email).toBe('pedro@email.com');
  });

  it('should throw ConflictException when email already exists', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(makeUser());

    await expect(
      service.create({
        name: 'Pedro',
        email: 'pedro@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should return a list of users', async () => {
    userRepositoryMock.findAll.mockResolvedValue([makeUser()]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0]).not.toHaveProperty('password');
  });

  it('should throw NotFoundException when user does not exist', async () => {
    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });
});
