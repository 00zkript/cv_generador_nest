import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './databases/database.module';
import { ExampleModule } from './modules/example/example.module';
import { CvModule } from './modules/cv/cv.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    DatabaseModule,
    CvModule,
    ExampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
