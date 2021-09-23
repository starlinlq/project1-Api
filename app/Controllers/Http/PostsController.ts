import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from '../../Models/Post'
import { upload } from 'App/services/Cloudinary'
import Profile from 'App/Models/Profile'
import Like from 'App/Models/Like'

export default class PostsController {
  public async index({ request, params, response }: HttpContextContract) {
    const page = params.id
    const limit = 12
    const headers = request.header('category')

    try {
      if (headers === 'all') {
        let posts = await Post.query().preload('likes').paginate(page, limit)

        if (posts) {
          return response.status(200).send(posts)
        }
      } else if (headers !== 'all' && headers) {
        let posts = await Post.query()
          .where('category_title', headers)
          .preload('likes')
          .paginate(page, limit)

        if (posts) {
          return response.status(200).send(posts)
        }
      }
    } catch (error) {
      return response.status(400).send('something went wrong')
    }
  }

  public async likePost({ auth, response, params }: HttpContextContract) {
    let post_id = params.id

    try {
      let user = await auth.authenticate()
      if (user) {
        let post = await Post.findBy('id', post_id)
        if (post) {
          let data = await post.related('likes').create({ userId: user.id })
          return response.status(200).send(data)
        }
      }
    } catch (error) {
      console.log(error)
      response.status(400).send(error)
    }
  }

  public async disLikePost({ response, params, auth }: HttpContextContract) {
    let like_id = params.id

    try {
      let user = await auth.authenticate()
      if (user) {
        await Like.query().where('id', like_id).delete()
        return response.status(200).send({ deleted: true })
      }
    } catch (error) {
      response.status(400).send(error)
    }
  }

  public async showAmount({ params, response }: HttpContextContract) {
    try {
      let limit = params.id
      let stories = await Post.query().limit(limit)
      return response.status(200).send(stories)
    } catch (error) {
      return response.status(400).send(error)
    }
  }

  public async userStories({ params, response }: HttpContextContract) {
    try {
      let stories = await Post.query().where('user_id', params.id)
      if (stories) {
        return response.status(200).send(stories)
      }
      response.unauthorized()
    } catch (error) {
      return response.status(400).send(error)
    }
  }
  public async show({ params, response }: HttpContextContract) {
    try {
      const post = await Post.query().where('id', params.id).preload('likes').preload('comments')

      if (post) {
        let profile = await Profile.find(post[0].user_id)

        if (profile) {
          return { post, url: profile.profile_pic_url }
        }
        return response.status(404).notFound()
      }
      return response.status(404).send('Not Found')
    } catch (error) {
      return response.status(401).send(error)
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()

      if (user) {
        const post = new Post()
        post.title = request.input('title')
        post.photo_url = request.input('photo_url')
        post.story = request.input('story')
        post.category_title = request.input('category')
        post.user_name = user.user_name

        await user.related('posts').save(post)
        return post.toJSON()
      }

      return response.unauthorized()
    } catch (error) {
      console.log(error)
      return response.status(400).send('something went wrong')
    }
  }

  public async update({ params, auth, request, response }: HttpContextContract) {
    console.log(params.id)
    try {
      let post = await Post.find(params.id)
      let user = await auth.authenticate()
      if (user.id === post!.userId && post) {
        post.title = request.input('title')
        post.story = request.input('story')
        post.photo_url = request.input('photo_url')

        await post.save()
        await post.preload('comments')
        return post
      }
      return response.status(402).send('something went wrong')
    } catch (error) {
      return response.status(401).send(error)
    }
  }

  public async search({ params, response }: HttpContextContract) {
    let query = params.id
    console.log(query)
    try {
      let data = await Post.query()
        .where('title', 'like', '%' + query + '%')
        .select(['title', 'id', 'photo_url', 'user_name'])
        .paginate(1, 10)
      return response.status(200).send(data)
    } catch (error) {
      console.log(error)
      return response.status(400).send(error)
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

  public async delete({ params, auth, response }: HttpContextContract) {
    try {
      let user = await auth.authenticate()
      if (user) {
        await Post.query().where('user_id', user.id).where('id', params.id).delete()
        return response.status(200).send('post deleted')
      }
      return response.unauthorized()
    } catch (error) {
      return response.status(401).send('something went wrong')
    }
  }
}
