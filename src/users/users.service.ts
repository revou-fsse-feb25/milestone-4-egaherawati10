import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { UsersServiceItf } from "./users.service.interface";
import { UsersRepositoryItf, UsersRepositoryToken } from "./users.repository.interface";

@Injectable()
export class UsersService implements UsersServiceItf {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly userRepository: UsersRepositoryItf
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.userRepository.create(data);
  }

  async updateUser(
    id: number,
    data: Prisma.UserUpdateInput,
    requesterId: number,
    requesterRole: string
  ): Promise<User> {
    if (requesterRole !== 'admin' && requesterId !== id) {
      throw new ForbiddenException('You can only update your own account');
    }
    return this.userRepository.update(id, data);
  }

  deleteUser(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }

  async getProfile(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const { password, ...profile } = user;
    return profile;
  }
}