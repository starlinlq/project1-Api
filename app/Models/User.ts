import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Post from '../Models/Post'
import {
  column,
  beforeSave,
  BaseModel,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Profile from '../Models/Profile'
import Comment from '../Models/Comment'
import Like from './Like'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string
  @column()
  public user_name: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @hasMany(() => Like)
  public likes: HasMany<typeof Like>

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'follower_id',
    pivotTable: 'followers',
  })
  public following: ManyToMany<typeof User>
  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'follower_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'followers',
  })
  public followers: ManyToMany<typeof User>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
