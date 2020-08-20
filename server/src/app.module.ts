import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisConfig } from './config/redis';


@Module({
  imports: [
    RedisModule.register(RedisConfig)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
