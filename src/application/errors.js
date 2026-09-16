export class CategoryNameConflictError extends Error {
  constructor(name) {
    super(`Category with name ${name} already exists.`);
    this.name = 'CategoryNameConflictError';
    this.categoryName = name;
  }
}