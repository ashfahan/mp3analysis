import { makeDomainFunction } from 'domain-functions'
import * as express from 'express'
import { Router } from 'express'
import { multer } from '../app'
import { FileSchema } from '../schema/FileSchema'
import { audioService } from '../services/audio/AudioService'

const router: Router = express.Router()

const post = makeDomainFunction(FileSchema)(async ({ buffer }) => {
  const { duration, frames } = await audioService.generateAudioData(buffer)
  return { frameCount: frames }
})

router.post('/', multer.single('audio'), async (req, res, next) => {
  try {
    const response = await post(req.file)
    if (!response.success) throw response
    res.status(200).send(response.data)
  } catch (error) {
    next({ status: 400, error })
  }
})

module.exports = router
