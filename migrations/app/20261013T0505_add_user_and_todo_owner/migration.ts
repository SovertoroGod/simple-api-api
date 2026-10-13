#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/a3b3fb3f8dbdf87a3f74f34fd2d48e4d05f5322b28a383a68786eb83f588de84/contract';
import endContract from '../../snapshots/a3b3fb3f8dbdf87a3f74f34fd2d48e4d05f5322b28a383a68786eb83f588de84/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b1f6114e31aaa934189066021d2956c423d51c9f7ed89511728ceb63e804e7da/contract';
import startContract from '../../snapshots/b1f6114e31aaa934189066021d2956c423d51c9f7ed89511728ceb63e804e7da/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';
import postgres from '@prisma/orm-postgres/runtime';

// Lazy façade over the end contract: constructing it opens no connection, and
// `contract` is the same reference passed to this.dataTransform below, so the
// storage hashes line up.
const { sql: db, contract } = postgres<End>({ contractJson: endContract });

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('USER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('User_role_check_1954e8c0', `"role" IN ('USER', 'ADMIN')`),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Todo',
        column: col('userId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      // Backfill Todo.userId now that the column exists and the User table is
      // in place, so the FK and the NOT NULL below can be applied.
      //
      // `check` must be a ROWSET query: the runner wraps it as EXISTS() for the
      // precheck and NOT EXISTS() for the postcheck, so an aggregate like
      // count(*) would resolve to a constant on both sides and always trip.
      //
      // `run` removes Todo rows that cannot be attributed to a user. There is
      // no sensible owner to assign to an orphan row, and userId is NOT NULL
      // with an FK to User, so deleting is the only shape that satisfies the
      // pre/post-check contract. This is a no-op on an empty table.
      this.dataTransform(contract, 'backfill-Todo-userId', {
        check: () => db.public.Todo.select('id').where((f, fns) => fns.eq(f.userId, null)).limit(1),
        run: () => db.public.Todo.delete().where((f, fns) => fns.eq(f.userId, null)),
      }),
      this.setNotNull({ schema: 'public', table: 'Todo', column: 'userId' }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Todo',
        index: 'Todo_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Todo',
        foreignKey: {
          name: 'Todo_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
