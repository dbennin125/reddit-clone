import {
  __prod__,
  __dbName__,
  __db_type__,
  __password__,
  __user__,
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
  user: __user__,
  password: __password__,
  type: __db_type__,
  driver: PostgreSqlDriver,
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
