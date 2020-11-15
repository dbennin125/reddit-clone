require('dotenv').config();

export const __prod__ = process.env.NODE_ENV === 'production'

export const __pg__password__ = process.env.PG_PASSWORD

export const __pg__user__ = process.env.PG_USER

export const __dbName__ = process.env.DB_NAME
