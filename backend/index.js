import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import { registerValidation, loginValidation, postCreateValidation } from './utils/validations.js'
import checkAuth from './utils/checkAuth.js'

dotenv.config()

// db connect
mongoose.connect(process.env.MONGO_DATABASE_LINK)
.then(() => console.log('БД подключена'))
.catch(() => console.log('БД не подключена. Ошибка'))

const app = express()

app.use(express.json())

// authorization
app.post('/auth/login', loginValidation, UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

// posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)


app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('Ошибка, не удалось запустить сервер!')
  } else {
    return console.log(`Сервер запущен! Порт ${process.env.PORT}`)
  }
})