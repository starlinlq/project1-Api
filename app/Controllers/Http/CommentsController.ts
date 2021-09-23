import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Post from '../../Models/Post'
import User from 'App/Models/User'

export default class CommentsController {
  public async show({ params, response }: HttpContextContract) {
    try {
      const comments = await User.query().where('post_id', params.id).orderBy('id', 'desc')
      return response.status(200).send(comments)
    } catch (error) {
      return response.status(400).send(error)
    }
  }
  public async store({ params, request, auth, response }: HttpContextContract) {
    try {
      let user = await auth.authenticate()
      let post = await Post.find(params.id)
      if (post && user) {
        let new_comment = new Comment()
        new_comment.comment = request.input('comment')
        new_comment.user_name = user.user_name
        await user.related('comments').save(new_comment)
        await post.related('comments').save(new_comment)
        return response.status(200).send(new_comment)
        // await post.related('comments').create({comment: request.input('comment'), userName: request.input('username')})
      }
      return response.status(404).send('the post wast not found')
    } catch (error) {
      response.status(400).send('something went wrong')
    }
  }
  public async update({ request, response, auth, params }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      let comment = await Comment.find(params.id)
      if (user && comment) {
        comment.comment = request.input('comment')
        await comment.save()
        return response.status(200).send('comment updated')
      }
      return response.unauthorized()
    } catch (error) {
      return response.status(400).send('something went wrong')
    }
  }

  public async delete({ params, auth, response }: HttpContextContract) {
    try {
      let user = await auth.authenticate()
      if (user) {
        let comment = await Comment.find(params.id)
        if (comment?.userId === user.id) {
          await Comment.query().where('id', params.id).delete()
          return response.status(200).send('comment deleted')
        }
        return response.status(404).send('Not Found')
      }
      return response.unauthorized()
    } catch (error) {
      console.log(error)
      return response.status(400).send('something went wrong')
    }
  }
}
