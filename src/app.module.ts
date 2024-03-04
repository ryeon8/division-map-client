import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/envs/${process.env.NODE_ENV}.env`,
      isGlobal: true, cache: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
