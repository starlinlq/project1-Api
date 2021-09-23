/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { OrmConfig } from '@ioc:Adonis/Lucid/Orm'
import Application from '@ioc:Adonis/Core/Application'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'
import Url from 'url-parse'
const CLEARDB_DATABASE_URL = new Url(Env.get(`CLEARDB_DATABASE_URL`))

const databaseConfig: DatabaseConfig & { orm: Partial<OrmConfig> } = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */

  connection: 'mysql',

  connections: {
    /*
    |--------------------------------------------------------------------------
    | SQLite
    |--------------------------------------------------------------------------
    |
    | Configuration for the SQLite database.  Make sure to install the driver
    | from npm when using this connection
    |
    | npm i sqlite3
    |
    */

    sqlite: {
      client: 'sqlite',
      connection: {
        filename: Application.tmpPath('db.sqlite3'),
      },
      migrations: {},
      useNullAsDefault: true,
      healthCheck: false,
      debug: false,
    },
    mysql: {
      client: 'mysql',
      connection: {
        host: CLEARDB_DATABASE_URL.host as string,
        port: Number(''),
        user: CLEARDB_DATABASE_URL.username as string,
        password: CLEARDB_DATABASE_URL.password as string,
        database: CLEARDB_DATABASE_URL.pathname.substr(1) as string,
      },
      healthCheck: false,
    },
  },

  /*
  |--------------------------------------------------------------------------
  | ORM Configuration
  |--------------------------------------------------------------------------
  |
  | Following are some of the configuration options to tweak the conventional
  | settings of the ORM. For example:
  |
  | - Define a custom function to compute the default table name for a given model.
  | - Or define a custom function to compute the primary key for a given model.
  |
  */
  orm: {},
}

export default databaseConfig
