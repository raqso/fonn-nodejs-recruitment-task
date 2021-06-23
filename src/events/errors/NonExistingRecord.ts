export class NonExistingRecord extends Error {
  constructor(id: string, entityName: string) {
    super(`Non existing ${id} record in ${entityName}s`);
    this.name = 'NonExistingRecord';
  }
}
