import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from './user.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; 
import { User } from './entities/user.entity'; 

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<IUserRepository>;

  const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'username'
  };

  beforeEach(async () => {
    const mockUserRepo: Partial<jest.Mocked<IUserRepository>> = {
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get('IUserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user when email is not taken', async () => {
      const dto: CreateUserDto = {
        email: 'new@example.com',
        password: 'plain-pass',
        name: "example"
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockImplementation(async (user) => ({
        ...mockUser,
        ...user,
      }));

      const result = await service.create(dto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(userRepository.create).toHaveBeenCalled();
      expect(result.email).toBe(dto.email);
      expect(result.password).not.toBe(dto.password);
    });

    it('should throw ConflictException when email is already in use', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: '123456',
        name: "example"
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      userRepository.findAll.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('user-id');

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith('user-id');
    });
  });

  describe('update', () => {
    it('should call update on the repository', async () => {
      const updateDto: UpdateUserDto = { email: 'updated@example.com' };
      userRepository.update.mockResolvedValue();

      await service.update('user-id', updateDto);

      expect(userRepository.update).toHaveBeenCalledWith('user-id', updateDto);
    });
  });

  describe('remove', () => {
    it('should call remove on the repository', async () => {
      userRepository.remove.mockResolvedValue();

      await service.remove('user-id');

      expect(userRepository.remove).toHaveBeenCalledWith('user-id');
    });
  });
});
