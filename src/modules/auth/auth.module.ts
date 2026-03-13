import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '@/databases/database.module';

@Module({
    imports: [
        // TypeOrmModule.forFeature([
        //     User, 
        //     UserProfile, 
        //     UserSkill, 
        //     UserExperience, 
        //     UserExperienceAchievement,
        //     UserEducation, 
        //     UserProject
        // ]),
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
    controllers: [AuthController, UsersController],
    providers: [
        AuthService, 
        UsersService, 
        JwtStrategy
    ],
    exports: [AuthService, UsersService],
})
export class AuthModule {}
