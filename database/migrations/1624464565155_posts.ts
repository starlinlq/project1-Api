import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.string('title', 255).notNullable()
      table.string('user_name', 250).references('user_name').inTable('users')
      table.text('story').notNullable()
      table.string('description', 500).notNullable()
      table.string('photo_url', 1000).notNullable()
      table.integer('user_id', 150).references('id').inTable('users').onDelete('CASCADE')
      table.string('category_title').notNullable()
      table.integer('category_id').notNullable().references('id').inTable('categories')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
