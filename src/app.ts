import * as dotenv from 'dotenv'
import type { ErrorRequestHandler } from 'express'
import * as express from 'express'
import * as createError from 'http-errors'
import * as Multer from 'multer'

dotenv.config()
export const multer = Multer({})
export const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/file-upload', require('./routes/api.route'))
app.use((req, res, next) => next(createError.NotFound()))

const errorRequest: ErrorRequestHandler = (error, req, res, next) => {
  console.error(JSON.stringify(error, null, 2))
  res.status(error.status || 500).send({
    error:
      error.message ?? error.error.environmentErrors?.length
        ? error.error.environmentErrors
        : error.error.inputErrors?.length
          ? error.error.inputErrors
          : error.error.errors,
  })
}

app.use(errorRequest)

app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`))
