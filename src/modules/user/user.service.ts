import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
//import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: createUserDto.password,
          status: 'ACTIVE',
        },
      });
    } catch (error) {
      throw new Error('Failed to create user', { cause: error });
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  //update(id: number, updateUserDto: UpdateUserDto) {
  //  return `This action updates a #${id} user`;
  //}

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
