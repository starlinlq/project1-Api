import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Followers extends BaseSchema {
  protected tableName = 'followers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id')
      table.integer('follower_id').unsigned()
      table.unique(['user_id', 'follower_id'])
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
