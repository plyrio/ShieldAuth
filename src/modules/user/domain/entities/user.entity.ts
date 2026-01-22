import { EmailVo } from '../value-objects/email.vo';
import { UserStatusEnum } from '../enums/user-status.enum';
import { PasswordHasher } from '../../../../lib/cryptography/password-hasher.interface';

type UserProps = {
  id?: number;
  name: string;
  email: EmailVo;
  password: string;
  status: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  private id?: number;
  private name: string;
  private email: EmailVo;
  private password: string;
  private status: UserStatusEnum;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.status = props.status;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  getId(): number | undefined {
    return this.id!;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): EmailVo {
    return this.email;
  }
  getStatus(): UserStatusEnum {
    return this.status;
  }
  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }
  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  changeName(name: string) {
    this.ensureIsActive();
    this.name = name;
    this.touch();
  }
  changeEmail(email: EmailVo) {
    this.ensureIsActive();
    this.email = email;
    this.touch();
  }
  changePassword(hashedPassword: string) {
    this.password = hashedPassword;
    this.touch();
  }
  checkPassword(rawPassword: string, hasher: PasswordHasher): Promise<boolean> {
    return hasher.compare(rawPassword, this.password);
  }
  activate() {
    if (this.status === UserStatusEnum.ACTIVE) {
      throw new Error(`User already active, you cannot perform this action`);
    }
    this.status = UserStatusEnum.ACTIVE;
    this.touch();
  }
  inactivate() {
    this.ensureIsActive(
      'User already is inactive, you cannot perform this action',
    );
    this.status = UserStatusEnum.INACTIVE;
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }

  private ensureIsActive(errorMEssage?: string) {
    if (this.status !== UserStatusEnum.ACTIVE) {
      throw new Error(
        !errorMEssage
          ? `Inactive user cannot perform this action`
          : `${errorMEssage}`,
      );
    }
  }

  static restore(props: UserProps) {
    return new User(props);
  }

  toDto() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getValue(),
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
