import {
  __prod__,
  __pg__password__,
  __pg__user__,
  __dbName__,
} from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: __dbName__,
  user: __pg__user__,
  password: __pg__password__,
  type: "postgresql",
  driver: PostgreSqlDriver,
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
