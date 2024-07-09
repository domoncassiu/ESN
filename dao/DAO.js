class DAO {
  constructor(dbClient) {
    if (new.target === DAO) {
      throw new Error(
        'Abstract constructor for DAO. Cannot construct DAO instances directly.',
      );
    }
    if (!dbClient) {
      throw new Error('A database client must be provided');
    }
    this.dbClient = dbClient;
  }

  async create() {
    throw new Error(
      'Cannot call abstract method create(). Cannot call abstract methods directly.',
    );
  }

  async read() {
    throw new Error(
      'Cannot call abstract method read(). Cannot call abstract methods directly.',
    );
  }

  async readAll() {
    throw new Error(
      'Cannot call abstract method readAll(). Cannot call abstract methods directly.',
    );
  }

  async update() {
    throw new Error(
      'Cannot call abstract method update(). Cannot call abstract methods directly.',
    );
  }

  async delete() {
    throw new Error(
      'Cannot call abstract method delete(). Cannot call abstract methods directly.',
    );
  }
}

export default DAO;
