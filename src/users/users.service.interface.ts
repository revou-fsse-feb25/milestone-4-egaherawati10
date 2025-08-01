import { Prisma, User } from '@prisma/client';

export interface UsersServiceItf {
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: Prisma.UserCreateInput): Promise<User>;
  updateUser(id: number, data: Prisma.UserUpdateInput, requesterId: number, requesterRole: string): Promise<User>;
  deleteUser(id: number): Promise<void>;
}