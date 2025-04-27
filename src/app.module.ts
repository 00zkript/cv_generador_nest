import { Module } from '@nestjs/common';
import { ExampleModule } from './modules/example/example.module';
import { DatabaseModule } from './databases/database.module';
import { CvModule } from './modules/cv/cv.module';

@Module({
  imports: [
    DatabaseModule,
    CvModule,
    ExampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
