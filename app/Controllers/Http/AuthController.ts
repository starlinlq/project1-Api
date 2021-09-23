import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User'
import Profile from '../../Models/Profile'
import { upload } from 'App/services/Cloudinary'
import Like from 'App/Models/Like'

export default class AuthController {
  public async validate({ response, auth }: HttpContextContract) {
    try {
      let user = await auth.authenticate()
      if (user) {
        let userdata = await User.query()
          .where('id', user.id)
          .preload('profile')
          .preload('posts', (postQuery) => {
            postQuery.preload('likes')
          })
          .preload('following', (query) => {
            query.select(['id'])
          })
        const bookmark = await Like.query()
          .where('user_id', user.id)
          .preload('post', (postQuery) => {
            postQuery.preload('likes')
          })

        return { user: userdata, bookmark }
      }
      return response.unauthorized()
    } catch (error) {
      return response.status(400).send(error)
    }
  }

  public async register({ request, auth }: HttpContextContract) {
    let name = request.input('name')
    let email = request.input('email')
    let password = request.input('password')
    let city = request.input('city')
    let about = request.input('about')
    let photo_url = request.input('photo_url')

    let new_user = new User()
    let profile = new Profile()
    new_user.user_name = name
    new_user.email = email
    new_user.password = password
    profile.user_name = name
    profile.about_me = about
    profile.profile_pic_url = photo_url
    profile.city = city
    //save the user
    await new_user.save()
    await new_user.related('profile').save(profile)
    await new_user.preload('profile')
    //create token
    const token = await auth.use('api').login(new_user, {
      expiresIn: '10 days',
    })
    return {
      name: new_user.user_name,
      id: new_user.id,
      profile: new_user.profile,
      token,
      photo_url,
    }
  }

  public async upload({ request, response }: HttpContextContract) {
    try {
      if (request.file('image')) {
        let cloudinary_response = await upload(request.file('image'))
        return response.status(200).send(cloudinary_response)
      }
      return response.json({ status: false, data: 'Please upload an Image.' })
    } catch (error) {
      //console.log(error)
      return response.status(500).json({ status: false, error: error.message })
    }
  }

  public async login({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '10 days',
    })
    return token.toJSON()
  }

  public async logOut({ response, auth }: HttpContextContract) {
    console.log('hello')
    try {
      let user = await auth.authenticate()
      if (user) {
        await auth.logout()
        if (auth.isLoggedOut) {
          return response.status(200).send('success')
        }
      }
      return response.unauthorized()
    } catch (error) {
      return response.status(400).send(error)
    }
  }
}
