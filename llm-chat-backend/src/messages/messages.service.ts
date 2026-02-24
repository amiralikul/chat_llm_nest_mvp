import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { asc, eq } from 'drizzle-orm';
import { generateText, CoreMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import * as schema from '../db/schema';
import { DB } from '../db/drizzle.module';

@Injectable()
export class MessagesService {
  constructor(@Inject(DB) private db: NodePgDatabase<typeof schema>) {}

  async findByThread(threadId: string) {
    return this.db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.threadId, threadId))
      .orderBy(asc(schema.messages.createdAt));
  }

  async sendMessage(threadId: string, content: string) {
    // Save user message
    const [userMessage] = await this.db
      .insert(schema.messages)
      .values({ threadId, role: 'user', content })
      .returning();

    // Load full conversation history
    const history = await this.findByThread(threadId);

    const messages: CoreMessage[] = history.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Generate AI response
    const result = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: 'You are a helpful assistant.',
      messages,
    });

    // Save assistant message
    const [assistantMessage] = await this.db
      .insert(schema.messages)
      .values({ threadId, role: 'assistant', content: result.text })
      .returning();

    // Update thread's updatedAt
    await this.db
      .update(schema.threads)
      .set({ updatedAt: new Date() })
      .where(eq(schema.threads.id, threadId));

    return { userMessage, assistantMessage };
  }
}
