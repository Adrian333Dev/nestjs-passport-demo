import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { email },
    });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      return passwordMatch ? { ...user, password: null } : null;
    }

    return null;
  }

  async register(user: Prisma.UserCreateInput) {
    const hash = await bcrypt.hash(user.password, 10);
    const { password, ...result } = await this.prismaService.user.create({
      data: { ...user, password: hash },
    });
    return result;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
