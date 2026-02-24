import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { ThreadsService } from '../threads/threads.service';

@Controller('threads/:threadId/messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(
    private messages: MessagesService,
    private threads: ThreadsService,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: { sub: string },
    @Param('threadId') threadId: string,
  ) {
    await this.threads.assertOwnership(user.sub, threadId);
    return this.messages.findByThread(threadId);
  }

  @Post()
  async send(
    @CurrentUser() user: { sub: string },
    @Param('threadId') threadId: string,
    @Body('content') content: string,
  ) {
    await this.threads.assertOwnership(user.sub, threadId);
    return this.messages.sendMessage(threadId, content);
  }
}
