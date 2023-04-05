export class ModuleIdIssuer {
  constructor(
    private cache: Map<string, number> = new Map(),
    private id: number = 1
  ) {}

  nextIdentity(modulePath: string) {
    const moduleId = this.cache.get(modulePath);
    if (moduleId) return moduleId;

    this.id = this.id + 1;
    this.cache.set(modulePath, this.id);
    return this.id;
  }

  getIdByModulePath(modulePath: string) {
    return this.cache.get(modulePath);
  }

  get() {
    return this.id;
  }
}
