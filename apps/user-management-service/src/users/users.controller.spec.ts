import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response-.dto';
import { AuthResponseDto } from './dto/auth-reponse.dto';
import { plainToInstance } from 'class-transformer';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;
  let authService: jest.Mocked<AuthService>;

  const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "username"
  };

  const mockUserResponse = plainToInstance(UserResponseDto, mockUser, {
    excludeExtraneousValues: true,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login and return token', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: '123456' };
      const tokenResponse: AuthResponseDto = { accessToken: 'jwt-token' };

      authService.login.mockResolvedValue(tokenResponse);

      const result = await controller.login(dto);

      expect(result).toEqual(tokenResponse);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('create', () => {
    it('should create a user and return response DTO', async () => {
      const dto: CreateUserDto = {
        email: 'new@example.com',
        password: '123456',
        name: "example"
      };

      usersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      usersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();

      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      usersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('user-id');

      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { email: 'updated@example.com' };

      usersService.update.mockResolvedValue();

      await controller.update('user-id', dto);

      expect(usersService.update).toHaveBeenCalledWith('user-id', dto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      usersService.remove.mockResolvedValue();

      await controller.remove('user-id');

      expect(usersService.remove).toHaveBeenCalledWith('user-id');
    });
  });
});
