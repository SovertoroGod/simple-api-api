#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/b1f6114e31aaa934189066021d2956c423d51c9f7ed89511728ceb63e804e7da/contract';
import endContract from '../../snapshots/b1f6114e31aaa934189066021d2956c423d51c9f7ed89511728ceb63e804e7da/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.dataTransform(endContract, '...', {
        check: () => true,
        run: async () => { },
      }),

      this.createTable({
        schema: 'public',
        table: 'Todo',
        columns: [
          col('completed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
