import { Controller, Post, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from './decorators/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Public()
  @Post('register')
  async register(@Request() req) {
    return this.authService.register(req.body);
  }
}
