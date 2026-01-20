import type { PasswordHasher } from './../../lib/cryptography/password-hasher.interface';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/application/user.service';
import {
  ResponseSignInDto,
  ResponseSignInDtoSchema,
} from './auth.dto/response-signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async signIn(email: string, pass: string): Promise<ResponseSignInDto> {
    const user = await this.userService.findByEmailForAuth(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await user.checkPassword(pass, this.passwordHasher);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return ResponseSignInDtoSchema.parse({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail().getValue(),
    });
  }
}
