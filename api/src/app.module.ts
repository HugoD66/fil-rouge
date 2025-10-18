import { Module } from '@nestjs/common';
import { AppController } from '@fil-rouge/api/app.controller';
import { AppService } from '@fil-rouge/api/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
