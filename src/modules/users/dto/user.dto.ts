import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;
}

export class UpdateUserDto extends CreateUserDto {}

export class UserResponseDto {
    id: number;
    name: string;
    email: string;
}