import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import multer from 'multer'
import { UserController, PostController } from './controllers/index.js'

// TODO: refactor this imports
import { registerValidation, loginValidation, postCreateValidation } from './utils/validations.js'
import checkAuth from './utils/checkAuth.js'
import handleValidationErrors from './utils/handleValidationErrors.js'


dotenv.config()

// db connect
mongoose.connect(process.env.MONGO_DATABASE_LINK)
.then(() => console.log('БД подключена'))
.catch(() => console.log('БД не подключена. Ошибка'))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })

app.use(express.json())
// for work /w static files
app.use('/uploads', express.static('uploads'))

// authorization
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

// file upload
app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

// posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

// run server
app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('Ошибка, не удалось запустить сервер!')
  } else {
    return console.log(`Сервер запущен! Порт ${process.env.PORT}`)
  }
})