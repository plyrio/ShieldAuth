import { User } from '../entities/user.entity';
import { EmailVo } from '../value-objects/email.vo';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: EmailVo): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
  findByEmailForAuth(email: EmailVo): Promise<User | undefined>;
}
