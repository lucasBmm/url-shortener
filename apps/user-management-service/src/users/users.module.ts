import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IUserRepository } from './user.repository.interface';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/db/database.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    PassportModule,
  ],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UsersService,
  ],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
