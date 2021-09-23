import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class FollowersController {
  public async store({ request, auth, response }: HttpContextContract) {
    const follower_id = request.input('follower_id')
    console.log(follower_id)

    try {
      const user = await auth.authenticate()

      if (user) {
        await user.related('following').attach([follower_id])
        return response.send({ done: 'yes' })
      }
      return response.status(400)
    } catch (error) {
      console.log(error)
    }
  }

  public async show({ response, request, params }: HttpContextContract) {
    let id = params.id
    const limit = request.header('limit')
    const current = request.header('current')

    try {
      if (current === 'Following') {
        const user = await User.query()
          .where('id', id)
          .preload('following', (query) => {
            query.select(['id', 'user_name'])
            query.preload('profile', (profileQuery) => {
              profileQuery.select('profile_pic_url')
            })
          })
        if (user) {
          response.status(200).send({ data: user[0].following })
        }
      } else {
        const user = await User.query()
          .where('id', id)
          .preload('followers', (query) => {
            query.select(['id', 'user_name'])
            query.limit(parseInt(limit!))
            query.preload('profile', (profileQuery) => {
              profileQuery.select('profile_pic_url')
            })
          })
          .select(['user_name', 'id'])
        if (user) {
          response.status(200).send({ data: user[0].followers })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async unfollow({ auth, response, params }: HttpContextContract) {
    let id = params.id
    try {
      const user = await auth.authenticate()
      if (user) {
        await user.related('following').detach([id])
        return response.status(200)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async remove({ params, auth, response }: HttpContextContract) {
    try {
      let me = await auth.authenticate()
      if (me) {
        let user = await User.findBy('id', params.id)
        if (user) {
          await user.related('following').detach([me.id])
          return response.status(200)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}
