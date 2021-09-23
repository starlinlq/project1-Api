import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.string('title', 255).notNullable()
      table.string('user_name', 250)
      table.text('story').notNullable()
      table.string('description', 500).notNullable()
      table.string('photo_url', 1000).notNullable()
      table.integer('user_id', 150)
      table.string('category_title')
      table.integer('category_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
