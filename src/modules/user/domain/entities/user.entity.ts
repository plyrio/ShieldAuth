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

  // --- Getters ---
  getId() {
    return this.id!;
  }
  getName() {
    return this.name;
  }
  getEmail() {
    return this.email;
  }
  //getPassword() {
  //  return this.password;
  //}
  getStatus() {
    return this.status;
  }
  getCreatedAt() {
    return this.createdAt;
  }
  getUpdatedAt() {
    return this.updatedAt;
  }

  // --- Setters / comportamentos ---
  changeName(name: string) {
    if (this.status !== UserStatusEnum.ACTIVE) {
      throw new Error('Inactive user cannot perform this action');
    }
    this.name = name;
    this.touch();
  }
  changeEmail(email: EmailVo) {
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
    this.status = UserStatusEnum.ACTIVE;
    this.touch();
  }
  inactivate() {
    this.status = UserStatusEnum.INACTIVE;
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }

  // --- Restore para reconstituir do banco ---
  static restore(props: UserProps) {
    return new User(props);
  }

  // --- Converter para string o email ---
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
