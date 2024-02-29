import { makeDomainFunction } from 'domain-functions'
import * as express from 'express'
import { Router } from 'express'
import { multer } from '../app'
import { FileSchema } from '../schema/FileSchema'
import { audioService } from '../services/audio/AudioService'

const router: Router = express.Router()

// Domain function to make validate inputs based on schema
const post = makeDomainFunction(FileSchema)(async ({ buffer }) => {
  // generate Audio Data from file buffer
  const { duration, frames } = await audioService.generateAudioData(buffer)
  return { frameCount: frames }
})

// function to handle post request
router.post('/', multer.single('audio'), async (req, res, next) => {
  try {
    // process file inside the request
    const response = await post(req.file)
    // if there was some error throw the response object
    if (!response.success) throw response
    // return success reponse data
    res.status(200).send(response.data)
  } catch (error) {
    // if there was some error throw the response object to be handled in global error function in app.ts
    next({ status: 400, error })
  }
})

module.exports = router
