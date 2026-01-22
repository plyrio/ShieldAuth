import { User } from '../entities/user.entity';
import { EmailVo } from '../value-objects/email.vo';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: EmailVo, forAuth?: boolean): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}
