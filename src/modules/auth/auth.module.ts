import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { BcryptPasswordHasher } from '../../lib/cryptography/bcrypt-password-hasher';
import { AuthController } from './presentation/auth.controller';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './infra/auth.constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
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
