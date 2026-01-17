import { EmailVo } from './email.vo.js';
import { UserStatusEnum } from './user-status.enum.js';

type UserProps = {
  id?: number;
  name: string;
  email: EmailVo;
  passwordHash: string;
  status: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  private id?: number;
  private name: string;
  private email: EmailVo;
  private passwordHash: string;
  private status: UserStatusEnum;
  private createdAt: Date;
  private updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.status = UserStatusEnum.ACTIVE;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? this.createdAt;
  }

  setId(id: number) {
    if (this.id) {
      throw new Error('User already has an id');
    }
    this.id = id;
  }

  activate() {
    if (this.status === UserStatusEnum.ACTIVE) {
      throw new Error('User is already active.');
    }
    this.status = UserStatusEnum.ACTIVE;
    this.updatedAt = new Date();
  }

  inactivate() {
    if (this.status === UserStatusEnum.INACTIVE) {
      throw new Error('User is already inactive.');
    }
    this.status = UserStatusEnum.INACTIVE;
    this.updatedAt = new Date();
  }

  changePassword(newPassword: string) {
    if (this.passwordHash === newPassword) {
      throw new Error('New password must be different from current password');
    }

    this.passwordHash = newPassword;
    this.updatedAt = new Date();
  }

  changeName(name: string) {
    if (this.status === UserStatusEnum.INACTIVE) {
      throw new Error('Inactive user cannot perform this action');
    }
    this.name = name;
    this.updatedAt = new Date();
  }

  changeEmail(email: EmailVo) {
    if (this.status === UserStatusEnum.INACTIVE) {
      throw new Error('Inactive user cannot perform this action');
    }
    this.email = email;
    this.updatedAt = new Date();
  }

  getName() {
    return this.name;
  }

  getStatus() {
    return this.status;
  }

  getId() {
    return this.id;
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
