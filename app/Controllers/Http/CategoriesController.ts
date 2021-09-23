import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Post from 'App/Models/Post'

export default class CategoriesController {
  async show({ request, params, response }: HttpContextContract) {
    const limit = request.header('limit')

    try {
      if (limit) {
        let data = await Post.query()
          .where('category_title', params.id)
          .preload('likes')
          .limit(parseInt(limit))
        return response.status(200).send(data)
      } else {
        let data = await Post.query().where('category_title', params.id).preload('likes')
        return response.status(200).send(data)
      }
    } catch (error) {
      return response.send(error)
    }
  }
}
