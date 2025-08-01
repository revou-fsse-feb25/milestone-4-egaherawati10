import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole, UserStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  password: 'hashedpassword',
  status: UserStatus.active,
  role: UserRole.user,
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user (ADMIN)', async () => {
    const dto: CreateUserDto = {
      name: 'Jane',
      username: 'jane123',
      email: 'jane@example.com',
      password: 'securepass',
      status: UserStatus.active,
      role: UserRole.user,
    };
    mockUsersService.createUser.mockResolvedValue(mockUser);

    const result = await controller.create(dto);
    expect(result).toEqual(mockUser);
    expect(mockUsersService.createUser).toHaveBeenCalledWith(dto);
  });

  it('should return all users (ADMIN)', async () => {
    mockUsersService.getAllUsers.mockResolvedValue([mockUser]);
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
  });

  it('should return one user by ID (ADMIN)', async () => {
    mockUsersService.getUserById.mockResolvedValue(mockUser);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found', async () => {
    mockUsersService.getUserById.mockResolvedValue(null);
    await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a user if permitted', async () => {
    const dto: UpdateUserDto = {
      name: 'Updated Name',
    };

    mockUsersService.updateUser.mockResolvedValue({ ...mockUser, ...dto });

    const result = await controller.update(1, dto, {
      user: { id: 1, role: UserRole.user },
    });

    expect(result).toEqual({ ...mockUser, ...dto });
    expect(mockUsersService.updateUser).toHaveBeenCalledWith(1, dto, 1, UserRole.user);
  });

  it('should delete user by ID (ADMIN)', async () => {
    mockUsersService.getUserById.mockResolvedValue(mockUser);
    mockUsersService.deleteUser.mockResolvedValue(undefined);

    const result = await controller.remove(1);
    expect(result).toEqual({ message: 'User 1 deleted successfully' });
    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should return current user profile', () => {
    const result = controller.getProfile({ user: mockUser });
    expect(result).toEqual(mockUser);
  });
});
