import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Comment from '../Models/Comment'

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
  public user_name: string
  @column()
  public photo_url: string
  @column()
  public userId: number
  @column()
  public category_id: number
  @column()
  public category_title: string
  @hasMany(() => Like)
  public likes: HasMany<typeof Like>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>
}
