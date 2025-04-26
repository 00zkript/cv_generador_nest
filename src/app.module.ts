import { Module } from '@nestjs/common';
import { ExampleModule } from './modules/example/example.module';
import { DatabaseModule } from './databases/database.module';

@Module({
  imports: [
    DatabaseModule,
    ExampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
