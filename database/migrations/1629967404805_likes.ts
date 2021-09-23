import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Likes extends BaseSchema {
  protected tableName = 'likes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.integer('post_id').references('id').inTable('posts').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
