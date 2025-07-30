import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-reponse.dto';
import { AuthService } from '../auth/auth.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response-.dto';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);

    const response = plainToInstance(UserResponseDto, createdUser, {
      excludeExtraneousValues: true,
    });

    return response;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
