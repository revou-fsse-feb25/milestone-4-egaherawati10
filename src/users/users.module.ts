import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepositoryToken } from './users.repository.interface';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, {
    provide: UsersRepositoryToken,
    useClass: UsersRepository,
  }],
  exports: [UsersService],
})
export class UsersModule {}
