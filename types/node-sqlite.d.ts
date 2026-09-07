// Minimal ambient types for Node's built-in `node:sqlite` module.
//
// This ships inside Node itself (stable since Node 22) but the installed
// @types/node version here predates it, so TypeScript doesn't know the
// module exists without this file.

declare module "node:sqlite" {
  export type SQLInputValue = string | number | bigint | Buffer | null;
  export type SQLOutputValue = string | number | bigint | Buffer | null;

  export interface StatementResultingChanges {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export class StatementSync {
    run(...params: unknown[]): StatementResultingChanges;
    get(...params: unknown[]): Record<string, SQLOutputValue> | undefined;
    all(...params: unknown[]): Array<Record<string, SQLOutputValue>>;
  }

  export interface DatabaseSyncOptions {
    open?: boolean;
    readOnly?: boolean;
  }

  export class DatabaseSync {
    constructor(location: string, options?: DatabaseSyncOptions);
    close(): void;
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
  }
}
