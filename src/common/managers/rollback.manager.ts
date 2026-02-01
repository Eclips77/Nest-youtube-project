import { Injectable, Scope, Logger } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RollbackManager {
  private undoTasks: (() => Promise<void>)[] = [];
  private readonly logger = new Logger(RollbackManager.name);

  /**
   * Registers an undo task to be executed in case of failure.
   * Tasks are executed in LIFO (Last-In-First-Out) order.
   * @param task A function that performs the undo operation (e.g., delete file, rollback DB).
   */
  addUndoTask(task: () => Promise<void>) {
    this.undoTasks.push(task);
  }

  /**
   * Executes all registered undo tasks in reverse order.
   * Each task is wrapped in a try-catch to ensure one failure doesn't stop the rest.
   */
  async executeRollback() {
    this.logger.warn('Initiating Rollback Sequence...');

    while (this.undoTasks.length > 0) {
      const task = this.undoTasks.pop();
      if (task) {
        try {
          await task();
        } catch (error) {
          this.logger.error(`Failed to execute undo task: ${error instanceof Error ? error.message : error}`, error);
          // Continue with other tasks despite failure
        }
      }
    }

    this.logger.warn('Rollback Sequence Completed.');
  }

  /**
   * Clears all registered tasks. useful if operation succeeds and we don't want to keep them in memory (though request scope handles cleanup).
   */
  clearTasks() {
    this.undoTasks = [];
  }
}
