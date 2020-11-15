require("dotenv").config();

export const __prod__ = process.env.NODE_ENV === "production";

export const __password__ = process.env.PG_PASSWORD;

export const __user__ = process.env.PG_USER;

export const __dbName__ = process.env.DB_NAME;

export const __db_type__ = process.env.DB_TYPE;

export const salt_rounds = Number(process.env.SALT_ROUNDS) || 15;

export const PORT = process.env.PORT || 5040;
