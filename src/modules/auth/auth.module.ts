import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BcryptPasswordHasher } from '../../lib/cryptography/bcrypt-password-hasher';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    AuthService,
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasher,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
