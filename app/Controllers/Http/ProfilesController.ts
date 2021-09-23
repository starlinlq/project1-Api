import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Profile from '../../Models/Profile'

export default class ProfilesController {
  public async show({ response, params }: HttpContextContract) {
    try {
      let user = await User.query()
        .where('id', params.id)
        .preload('profile')
        .preload('posts', (query) => {
          query.preload('likes')
        })
        .preload('following', (query) => {
          query.select(['id'])
        })
        .preload('followers', (query) => {
          query.select(['id'])
        })
        .select(['user_name', 'id'])
      return response.status(200).send({
        posts: user[0].posts,
        profile: [user[0].profile],
        followersCount: user[0].followers.length,
        followingCount: user[0].following.length,
      })
    } catch (error) {
      return response.status(400).send(error)
    }
  }
  public async update({ response, auth, request }: HttpContextContract) {
    let user = await auth.authenticate()
    try {
      if (user) {
        let profile = await Profile.find(user.id)
        if (profile && profile.userId === user.id) {
          console.log(request.input('name'))
          profile.about_me = request.input('about')
          user.user_name = request.input('name')
          profile.city = request.input('city')
          profile.profile_pic_url = request.input('url')
          await profile.save()
          await user.save()
          return response.status(200).send(profile)
        }
        return response.notFound()
      }
      return response.unauthorized()
    } catch (error) {
      return response.status(400).send('something went wrong')
    }
  }

  public async search({ response, params }: HttpContextContract) {
    let query = params.id
    try {
      let results = await Profile.query()
        .where('user_name', 'like', query)
        .select(['user_id', 'user_name', 'profile_pic_url'])
        .limit(30)
      return response.status(200).send(results)
    } catch (error) {
      return response.status(400).send(error)
    }
  }
}
