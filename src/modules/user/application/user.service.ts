import type { IUserRepository } from '../domain/repositories/user.repository.interface';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from '../presentation/dto/create-user.dto';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';
import {
  ResponseUserDto,
  ResponseUserSchema,
} from '../presentation/dto/response-user.dto';
import { EmailVo } from '../domain/value-objects/email.vo';
import { UserStatusEnum } from '../domain/enums/user-status.enum';
import { User } from '../domain/entities/user.entity';
import * as passwordHasherInterface from '../../../lib/cryptography/password-hasher.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,

    @Inject('PasswordHasher')
    private readonly passwordHasher: passwordHasherInterface.PasswordHasher,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const emailVo = new EmailVo(createUserDto.email);

    try {
      const existingUser = await this.userRepository.findByEmail(emailVo);
      if (existingUser) throw new ConflictException('Email already in use');

      const hashedPassword = await this.passwordHasher.hash(
        createUserDto.password,
      );

      const user = new User({
        name: createUserDto.name,
        email: emailVo,
        password: hashedPassword,
        status: UserStatusEnum.ACTIVE,
      });

      const savedUser = await this.userRepository.create(user);
      return ResponseUserSchema.parse(savedUser.toDto());
    } catch (error) {
      throw new ConflictException('Email already in use', error);
    }
  }

  async findAll(): Promise<ResponseUserDto[]> {
    try {
      const users = await this.userRepository.findAll();
      return users.map((user) => ResponseUserSchema.parse(user.toDto()));
    } catch (error) {
      throw new NotFoundException('Users not found.', error);
    }
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);
      return ResponseUserSchema.parse(user.toDto());
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findByEmail(email: string): Promise<ResponseUserDto>;
  async findByEmail(email: string, forAuth: true): Promise<User>;
  async findByEmail(
    email: string,
    forAuth?: true,
  ): Promise<ResponseUserDto | User> {
    const emailVo = new EmailVo(email);
    const user = await this.userRepository.findByEmail(emailVo);
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    if (forAuth) return user;
    return ResponseUserSchema.parse(user.toDto());
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      if (updateUserDto.name) user.changeName(updateUserDto.name);
      if (updateUserDto.email)
        user.changeEmail(new EmailVo(updateUserDto.email));
      if (updateUserDto.password) user.changePassword(updateUserDto.password);

      const updatedUser = await this.userRepository.update(user);
      return {
        message: `User with ID ${id} updated successfully`,
        updatedUser: ResponseUserSchema.parse(updatedUser.toDto()),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      await this.userRepository.delete(id);

      return {
        message: `User with ID ${id} deleted successfully`,
        deletedUser: ResponseUserSchema.parse(user.toDto()),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error);
    }
  }
}
