import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { AuthModule } from '../auth/auth.module';
import { ThreadsModule } from '../threads/threads.module';

@Module({
  imports: [AuthModule, ThreadsModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
