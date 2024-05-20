const Hapi = require(`@hapi/hapi`);
const Context = require(`./db/strategies/base/contextStrategy`);
const MongoDB = require(`./db/strategies/mongodb/mongodb`);
const HeroiSchema = require(`./db/strategies/mongodb/schemas/heroisSchema`);
const HeroRoute = require(`./routes/heroRoutes`);
const Joi = require(`joi`);


function mapRoutes(instance, methods) {
  // o methods vai pegar a lista de nome dos metodos da classe (no caso HeroRoute)
  // ----------> [`list`, `create`, `update`]
  // aqui seria a instancia da class (HeroRoute) e podemos chamar os metodos pela lista
  // ----------> new HeroRoute()[`list`]()
  // que seria a mesma coisa de fazer isso
  // ----------> new HeroRoute().list()

  return methods.map(method => instance[method]());

  // new HeroRoute().list();
  // ah é o heroRoute? é, qual o metodo? é o list, entao vou executar ele ().
  // a ideia ai é que independente da instancia que vc passar, da rota se for de heroi, de alunos...
  // independente dos metodos, se tem um listar com nome diferente ou coisa do tipo, vc consegue
  // pegar todos os metodos dinamicamente, fazer esse contexto rodar em diferentes rotas/bancos/contextos.

}

async function main() {
  const app = new Hapi.server({
    port: 5000,
    host: `localhost`
  });

  const connection = await MongoDB.connect();
  const context = new Context(new MongoDB(connection, HeroiSchema));
  await context.isConnected();
  app.validator(Joi);
  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
  ])

  await app.start(); 
  console.log('Server running on %s', app.info.uri);

  return app;

}

module.exports = main();
