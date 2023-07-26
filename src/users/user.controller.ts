// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, UseFilters, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from './user.entity';
import { HttpExceptionFilter } from 'src/common/filters/http-ex.filter';
import { HttpCacheInterceptor } from 'src/common/interceptors/http-cache.interceptor';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(HttpCacheInterceptor)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser: User = await this.userService.createUser(createUserDto);
      return newUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
    return User;
  }

  @Get()
  // @UseGuards(RolesGuard)
  @Roles('admin') // Chỉ admin mới có quyền truy cập API này
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
