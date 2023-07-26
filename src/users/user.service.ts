import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRole, UserStatus } from 'src/common/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.status = UserStatus.ACTIVE;
    createUserDto.roleId = UserRole.USER;
    const newUser: User = this.userRepository.create(createUserDto);
    try {
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getLoginUser(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // this.cacheManager;
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch login user');
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user by ID');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      this.userRepository.merge(user, updateUserDto);
      await this.userRepository.save(user);
      return 'User updated successfully';
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<string> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
      return 'User deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
