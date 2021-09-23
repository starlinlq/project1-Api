/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', ({ request, response }) => response.send('running'))
  Route.post('register', 'AuthController.register')
  Route.post('upload', 'AuthController.upload')
  Route.post('login', 'AuthController.login')
  Route.get('validate', 'AuthController.validate').middleware('auth:api')
  Route.get('logout', 'AuthController.logOut').middleware('auth:api')
}).prefix('api')

Route.group(() => {
  Route.get('show/:id', 'PostsController.show')
  Route.get('stories/page/:id', 'PostsController.index')
  Route.get('category/:id', 'CategoriesController.show')
  Route.get('show/amount/:id', 'PostsController.showAmount')
  Route.get('search/:id', 'PostsController.search')

  Route.group(() => {
    Route.post('create', 'PostsController.store')
    Route.put('update/:id', 'PostsController.update')
    Route.delete('delete/:id', 'PostsController.delete')
    Route.post('like/:id', 'PostsController.likePost')
    Route.delete('like/:id', 'PostsController.disLikePost')
  }).middleware('auth:api')
}).prefix('api/post')

Route.group(() => {
  Route.post('create/:id', 'CommentsController.store')
  Route.put('update/:id', 'CommentsController.update')
  Route.delete('delete/:id', 'CommentsController.delete')
})
  .prefix('api/comment')
  .middleware('auth:api')

Route.group(() => {
  Route.get('show/:id', 'FollowersController.show')
  Route.post('follow', 'FollowersController.store').middleware('auth:api')
  Route.delete('unfollow/:id', 'FollowersController.unfollow').middleware('auth:api')
  Route.delete('remove/:id', 'FollowersController.remove')
}).prefix('api/follower')

Route.group(() => {
  Route.get(':id', 'ProfilesController.show')
  Route.get('search/:id', 'ProfilesController.search')
  Route.group(() => {
    Route.put('update', 'ProfilesController.update')
  }).middleware('auth:api')
}).prefix('api/profile')
