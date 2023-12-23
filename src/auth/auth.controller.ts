import { Controller, Request, Post, UseGuards, Req } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return req.user;
    // return this.authService.login(req.user);
  }
}
