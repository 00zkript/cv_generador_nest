import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
    sub: number;
    email: string;
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: number;
        email: string;
        name: string | null;
    };
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await this.usersService.validatePassword(user, password))) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !(await this.usersService.validatePassword(user, loginDto.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { sub: user.id, email: user.email };
        
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        const user = await this.usersService.create(
            registerDto.email,
            registerDto.password,
            registerDto.name,
        );

        const payload: JwtPayload = { sub: user.id, email: user.email };
        
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}
