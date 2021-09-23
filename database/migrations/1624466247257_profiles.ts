import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Profiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('city', 255).notNullable().defaultTo('Going Places')
      table.string('user_name', 255).notNullable()
      table
        .text('profile_pic_url')
        .notNullable()
        .defaultTo(
          'https://images.saatchiart.com/saatchi/984876/art/6484557/5554235-FNOTTBWC-7.jpg'
        )
      table.text('about_me').notNullable().defaultTo('Living')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
