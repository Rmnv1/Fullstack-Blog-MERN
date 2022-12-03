import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import * as UserController from './controllers/UserController.js'
import { registerValidation } from './validations/auth.js'
import checkAuth from './utils/checkAuth.js'

dotenv.config()

mongoose.connect(process.env.MONGO_DATABASE_LINK)
.then(() => console.log('БД подключена'))
.catch(() => console.log('БД не подключена. Ошибка'))

const app = express()

app.use(express.json())

app.post('/auth/login', UserController.login)

app.post('/auth/register', registerValidation, UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('Ошибка, не удалось запустить сервер!')
  } else {
    return console.log(`Сервер запущен! Порт ${process.env.PORT}`)
  }
})