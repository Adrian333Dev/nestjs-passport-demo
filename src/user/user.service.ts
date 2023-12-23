import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const userResponse = await this.prismaService.user.create({
      data: { ...createUserDto, password: hash },
    });
    userResponse.password = undefined;
    return userResponse;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOneById(id: number) {
    const user = this.prismaService.user.findUniqueOrThrow({ where: { id } });
    return user;
  }

  async findOneByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { email },
    });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      return passwordMatch ? { ...user, password: null } : null;
    }

    return null;
  }

  update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
