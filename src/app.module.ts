import { Module } from '@nestjs/common';
import { ExampleModule } from './modules/example/example.module';
import { UsersModule } from './modules/users/users.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ExperiencesModule } from './modules/experiences/experiences.module';
import { EducationModule } from './modules/education/education.module';
import { PersonalInfoModule } from './modules/personal-info/personal-info.module';
import { ContactInfoModule } from './modules/contact-info/contact-info.module';
import { ReferencesModule } from './modules/references/references.module';
import { DatabaseModule } from './databases/database.module';

@Module({
  imports: [
    DatabaseModule,
    ExampleModule,
    UsersModule,
    SkillsModule,
    ExperiencesModule,
    EducationModule,
    PersonalInfoModule,
    ContactInfoModule,
    ReferencesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
