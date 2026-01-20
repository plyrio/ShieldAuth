import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { PrismaService } from '../../prisma.service';
import { PrismaUserRepository } from './infra/db/prisma-user.repository';
import { BcryptPasswordHasher } from '../../lib/cryptography/bcrypt-password-hasher';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasher,
    },
    PrismaService,
  ],
  exports: [UserService],
})
export class UserModule {}
