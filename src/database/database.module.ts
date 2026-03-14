import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { DataSourceOptions } from 'typeorm'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {

                const config: DataSourceOptions = {
                    type: configService.getOrThrow<'postgres'>('database.postgres.type'),
                    host: configService.getOrThrow<string>('database.postgres.host'),
                    port: configService.getOrThrow<number>('database.postgres.port'),
                    username: configService.getOrThrow<string>('database.postgres.username'),
                    password: configService.getOrThrow<string>('database.postgres.password'),
                    database: configService.getOrThrow<string>('database.postgres.database'),
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    synchronize: configService.getOrThrow<boolean>('database.postgres.synchronize'),
                    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
                    logging: false,
                }

                return config
            },
        }),
    ],
})
export class DatabaseModule {}