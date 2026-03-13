import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { usersProviders } from './providers/user.provides';
import { DatabaseModule } from '@/databases/database.module';

@Module({
    imports: [
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET') || 'default-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        ...usersProviders,
        AuthService, 
        UsersService, 
        JwtStrategy
    ],
    exports: [AuthService, UsersService],
})
export class AuthModule {}
