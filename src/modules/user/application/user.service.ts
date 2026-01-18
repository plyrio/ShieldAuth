import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../presentation/dto/create-user.dto';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';
import { PrismaService } from '../../../prisma.service';
import {
  ResponseUserDto,
  ResponseUserSchema,
} from '../presentation/dto/response-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: createUserDto.password,
          status: 'ACTIVE',
        },
      });
      return ResponseUserSchema.parse(user);
    } catch (error) {
      throw new ConflictException('Email already in use', error);
    }
  }

  async findAll(): Promise<ResponseUserDto[]> {
    try {
      const usersData = await this.prisma.user.findMany();
      return usersData.map((user) => ResponseUserSchema.parse(user));
    } catch (error) {
      throw new NotFoundException('Users not found.', error);
    }
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      return ResponseUserSchema.parse(user);
    } catch (error) {
      throw new NotFoundException(`User of id: ${id} not found`, error);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return ResponseUserSchema.parse(user);
    } catch (error) {
      throw new NotFoundException(`User with email: ${email} not found`, error);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; updatedUser: ResponseUserDto }> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { ...updateUserDto },
      });
      return {
        message: `User with id: ${id} successfully updated`,
        updatedUser: ResponseUserSchema.parse(user),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `Failed to update user of ID ${id}`,
      );
    }
  }

  async remove(
    id: number,
  ): Promise<{ message: string; deletedUser: ResponseUserDto }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.prisma.user.delete({
        where: { id },
      });

      return {
        message: `User with ID #${id} successfully deleted`,
        deletedUser: ResponseUserSchema.parse(user),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `Failed to delete user of id: ${id}`,
      );
    }
  }
}
