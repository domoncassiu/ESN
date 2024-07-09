class AbstractDBClient {
  constructor() {
    if (this.constructor === AbstractDBClient) {
      throw new TypeError(
        'Abstract constructor for AbstractDBClient. Cannot construct AbstractDBClient instances directly.',
      );
    }
  }

  async connect() {
    throw new TypeError(
      'Cannot call abstract method connect(). Cannot call abstract methods directly.',
    );
  }

  async close() {
    throw new TypeError(
      'Cannot call abstract method disconnect(). Cannot call abstract methods directly.',
    );
  }

  async create() {
    throw new TypeError(
      'Cannot call abstract method create(). Cannot call abstract methods directly.',
    );
  }

  async update() {
    throw new TypeError(
      'Cannot call abstract method update(). Cannot call abstract methods directly.',
    );
  }

  async read() {
    throw new TypeError(
      'Cannot call abstract method read(). Cannot call abstract methods directly.',
    );
  }

  async readAll() {
    throw new TypeError(
      'Cannot call abstract method readAll(). Cannot call abstract methods directly.',
    );
  }

  async readAllWithPagination() {
    throw new TypeError(
      'Cannot call abstract method readAllWithPagination(). Cannot call abstract methods directly.',
    );
  }

  async delete() {
    throw new TypeError(
      'Cannot call abstract method delete(). Cannot call abstract methods directly.',
    );
  }

  async deleteAllTables() {
    throw new TypeError(
      'Cannot call abstract method deleteAllTables(). Cannot call abstract methods directly.',
    );
  }
}

export default AbstractDBClient;
