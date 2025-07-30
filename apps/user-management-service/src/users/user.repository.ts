import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/db/base.repository';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository
  extends BaseRepository<User, CreateUserDto, UpdateUserDto>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    repo: Repository<User>,
  ) {
    super(repo);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.repo.findOne({ where: { email } });
  }
}