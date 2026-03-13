import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './databases/database.module';
import { ExampleModule } from './modules/example/example.module';
import { CvModule } from './modules/cv/cv.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
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
