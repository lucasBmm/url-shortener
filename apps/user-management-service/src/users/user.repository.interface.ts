import { IRepository } from 'src/db/repository.interface';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface IUserRepository
  extends IRepository<User, CreateUserDto, UpdateUserDto> {
  findByEmail(email: string): Promise<User | undefined>;
}
