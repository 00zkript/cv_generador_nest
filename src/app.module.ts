import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

import { ExampleModule } from './modules/example/example.module';
import { CvModule } from './modules/cv/cv.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                databaseConfig,
                jwtConfig
            ],
        }),
        DatabaseModule,
        AuthModule,
        CvModule,
        ExampleModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
