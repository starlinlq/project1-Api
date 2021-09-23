'use strict'
import Env from '@ioc:Adonis/Core/Env'
var cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: Env.get('CLOUDINARY_API_KEY'),
  api_secret: Env.get('CLOUDINARY_API_SECRET'),
})

export const upload = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await cloudinary.uploader.upload(file.tmpPath, { folder: 'test' })

      resolve({ status: true, url: response.secure_url })
    } catch (error) {
      reject({ status: false, url: error.message })
    }
  })
}
