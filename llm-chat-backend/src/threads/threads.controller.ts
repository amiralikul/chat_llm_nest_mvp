import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('threads')
@UseGuards(AuthGuard)
export class ThreadsController {
  constructor(private threads: ThreadsService) {}

  @Get()
  async list(@CurrentUser() user: { sub: string }) {
    return this.threads.findAll(user.sub);
  }

  @Post()
  async create(
    @CurrentUser() user: { sub: string },
    @Body('title') title: string,
  ) {
    return this.threads.create(user.sub, title || 'New Chat');
  }

  @Delete(':id')
  async delete(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    return this.threads.delete(user.sub, id);
  }
}
