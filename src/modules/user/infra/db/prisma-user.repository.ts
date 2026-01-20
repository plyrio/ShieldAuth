import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { User } from '../../domain/entities/user.entity';
import { EmailVo } from '../../domain/value-objects/email.vo';
import { UserStatusEnum } from '../../domain/enums/user-status.enum';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmailForAuth(email: EmailVo): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });
    if (!user) return undefined;
    return User.restore({
      ...user,
      email: new EmailVo(user.email),
      status: user.status as UserStatusEnum,
    });
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        name: user.getName(),
        email: user.getEmail().getValue(),
        password: user['password'],
        status: user.getStatus(),
      },
    });

    return User.restore({
      ...created,
      email: new EmailVo(created.email),
      status: created.status as UserStatusEnum,
    });
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return User.restore({
      ...user,
      email: new EmailVo(user.email),
      status: user.status as UserStatusEnum,
    });
  }

  async findByEmail(email: EmailVo): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });
    if (!user) return null;
    return User.restore({
      ...user,
      email: new EmailVo(user.email),
      status: user.status as UserStatusEnum,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) =>
      User.restore({
        ...u,
        email: new EmailVo(u.email),
        status: u.status as UserStatusEnum,
      }),
    );
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.getId() },
      data: {
        name: user.getName(),
        email: user.getEmail().getValue(),
        password: user['password'],
        status: user.getStatus(),
      },
    });

    return User.restore({
      ...updated,
      email: new EmailVo(updated.email),
      status: updated.status as UserStatusEnum,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
