import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole, UserStatus } from 'src/common/constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsBoolean()
  gender: boolean;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsNotEmpty()
  @IsEnum(UserRole) // Use the UserRole enum for the "roleId" field
  roleId: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  dateOfBirth: Date;

  // Add other properties as needed for user updates
}
