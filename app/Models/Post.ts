import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Comment from '../Models/Comment'
import Category from './Category'
import Like from './Like'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public title: string
  @column()
  public story: string
  @column()
  public description: string
  @column()
  public userName: string
  @column()
  public photo_url: string
  @column()
  public userId: number
  @column()
  public categoryId: number
  @column()
  public categoryTitle: string
  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>
  @hasMany(() => Like)
  public likes: HasMany<typeof Like>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>
}
