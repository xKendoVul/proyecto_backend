import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Acceso a ruta privada',
      user,
    };
  }
}
