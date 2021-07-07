import {
  __dbName__,
  __db_type__,
  __user__,
  __password__,
  __prod__,
  __testDB__,
} from "./constants";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

export const ORMconfig = [
  {
    type: __db_type__,
    database: __dbName__,
    username: __user__,
    password: __password__,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  },
  {
    type: __db_type__,
    database: __testDB__,
    username: __user__,
    password: __password__,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  },
];
