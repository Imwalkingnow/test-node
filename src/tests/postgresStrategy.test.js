const assert = require(`assert`);
const Postgres = require(`./../db/strategies/postgres/postgres`);
const Context = require(`./../db/strategies/base/contextStrategy`);
const HeroiSchema = require(`./../db/strategies/postgres/schemas/heroiSchema`);

const MOCK_HEROI_CADASTRAR = { nome: `Gaviao Negro`, poder: `Flechas` };
const MOCK_HEROI_ATUALIZAR = { nome: `Batman`, poder: `Dinheiro` };

let context = {};
describe(`Postgres Strategy`, function () {
  this.timeout(Infinity);
  this.beforeAll(async function () {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroiSchema);
    context = new Context(new Postgres(connection, model));
    await context.delete();
    await context.create(MOCK_HEROI_ATUALIZAR);
  })
  it(`PostgresSQL Connection`, async function() {
    const result = await context.isConnected();
    assert.equal(result, true);
  })
  it(`cadastrar`, async function() {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  })
  it(`listar`, async function() {
    const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    // pegar a primeira posicao
    // const posicaoZero = result[0]
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  })
  it(`atualizar`, async function () {
    const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome });
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: 'Mulher Maravilha'
    }
    const [result] = await context.update(itemAtualizar.id, novoItem);
    const [itemAtualizado] = await context.read({ id: itemAtualizar.id });
    assert.deepEqual(result, 1);
    assert.deepEqual(itemAtualizado.nome, novoItem.nome);
    /*
      No Javascript temos uma técnica chamada rest/spread
      que é usada para mergear objetos ou separa-lo

      {
        nome: 'Batman',
        poder: 'Dinheiro'
      }

      {
        dataNascimento: '1998-01-01'
      }

    */
  })
  it(`remover por id`, async function() {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  })
});
