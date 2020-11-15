import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import express from "express";
import { FirstResolverEver } from "./resolvers/first";
import mikroConfig from "./mikro-orm.config";
import { MikroORM } from "@mikro-orm/core";
import { __pg__password__, __pg__user__, __prod__ } from "./constants";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const PORT = process.env.PORT || 5040;
const app = express();

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [FirstResolverEver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });
  // app.get('/', (_, res) => {
  //     res.send('are you listening?')
  // })

  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
