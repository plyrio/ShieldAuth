import type { PasswordHasher } from '../../../lib/cryptography/password-hasher.interface';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseUserSchema } from '../../user/presentation/dto/response-user.dto';
import { CreateUserDto } from '../../user/presentation/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email, true);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await user.checkPassword(pass, this.passwordHasher);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.getId(),
      name: user.getName(),
      email: user.getEmail().getValue(),
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      user: ResponseUserSchema.parse(user.toDto()),
      access_token,
    };
  }

  // AuthService
  async signUp(dto: CreateUserDto): Promise<any> {
    await this.userService.create(dto);

    return this.signIn(dto.email, dto.password);
  }
}
