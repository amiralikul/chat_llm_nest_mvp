import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { DB } from '../db/drizzle.module';

@Injectable()
export class ThreadsService {
  constructor(@Inject(DB) private db: NodePgDatabase<typeof schema>) {}

  async findAll(userId: string) {
    return this.db
      .select()
      .from(schema.threads)
      .where(eq(schema.threads.userId, userId))
      .orderBy(desc(schema.threads.updatedAt));
  }

  async create(userId: string, title: string) {
    const [thread] = await this.db
      .insert(schema.threads)
      .values({ userId, title })
      .returning();
    return thread;
  }

  async delete(userId: string, threadId: string) {
    const [thread] = await this.db
      .delete(schema.threads)
      .where(
        and(
          eq(schema.threads.id, threadId),
          eq(schema.threads.userId, userId),
        ),
      )
      .returning();

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return thread;
  }

  async assertOwnership(userId: string, threadId: string) {
    const [thread] = await this.db
      .select()
      .from(schema.threads)
      .where(
        and(
          eq(schema.threads.id, threadId),
          eq(schema.threads.userId, userId),
        ),
      )
      .limit(1);

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return thread;
  }
}
