import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders: Provider[] = [
  {
    provide: DataSource,
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.dbName'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        migrations: [__dirname + 'migrations/*.{ts,js}'],
        synchronize: configService.get<string>('node_env') === 'production', //? Just for container use
        extra: {
          connectionLimit: 10,
        },
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
