export class PersistenceError extends Error {
  constructor(operation, cause) {
    super(`Persistence operation failed: ${operation}`);
    this.name = 'PersistenceError';
    this.operation = operation;
    this.cause = cause;
  }
}

export class NotFoundError extends Error {
  constructor(entityName, id) {
    super(`${entityName} with id ${id} was not found.`);
    this.name = 'NotFoundError';
    this.entityName = entityName;
    this.id = id;
  }
}

export class DuplicateEntityError extends Error {
  constructor(entityName, id) {
    super(`${entityName} with id ${id} already exists.`);
    this.name = 'DuplicateEntityError';
    this.entityName = entityName;
    this.id = id;
  }
}