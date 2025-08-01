import { Account } from "@prisma/client";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

export interface AccountsRepositoryItf {
  findAll(): Promise<Account[]>;
  findById(id: number): Promise<Account | null>;
  findByUserId(userId: number): Promise<Account | null>;
  create(data: CreateAccountDto): Promise<Account>;
  update(id: number, data: UpdateAccountDto): Promise<Account>;
  delete(id: number): Promise<void>;
}
