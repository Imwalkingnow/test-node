const ICrud = require(`./../interfaces/interfaceCrud`);
const Sequelize = require(`sequelize`);

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }
  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.log(`fail!`, error);
      return false;
    }
  }
  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options)
    await model.sync();
    return model;
  }
  async create(item) {
    const { dataValues } = await this._schema.create(item);
    return dataValues;
  }
  async read(item = {}) {
    return await this._schema.findAll({where: item, raw: true});
  }
  async update(id, item) {
    return await this._schema.update(item, { where: { id } })
  }
  async delete(id) {
    const query = id ? { id } : {};
    return await this._schema.destroy({where: query});
  }
  static async connect() {
    const connection = new Sequelize(
      `heroes`,
      `Imwalkingnow`,
      `minhasenhasecreta`,
      {
        host: `localhost`,
        dialect: `postgres`,
        quoteIdentifiers: false,
        operatorsAliases: false,
        logging: false
      }
    )
    return connection;
  }
}

module.exports = Postgres;
