import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import * as schema from '../db/schema';
import { DB } from '../db/drizzle.module';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB) private db: NodePgDatabase<typeof schema>,
    private jwt: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const existing = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await this.db
      .insert(schema.users)
      .values({ email, passwordHash })
      .returning({ id: schema.users.id, email: schema.users.email });

    return this.signToken(user.id, user.email);
  }

  async signin(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async getUser(userId: string) {
    const [user] = await this.db
      .select({ id: schema.users.id, email: schema.users.email })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    return user ?? null;
  }

  private async signToken(userId: string, email: string) {
    const token = await this.jwt.signAsync({ sub: userId, email });
    return { token, user: { id: userId, email } };
  }
}
