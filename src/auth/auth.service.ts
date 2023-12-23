import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<User> {
    return await this.userService.findOneByEmailAndPassword(email, password);
  }
}
