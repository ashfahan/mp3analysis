import { calculateFrameData } from '../../helpers/calculateFrameData'
import { roundToMs } from '../../helpers/roundToMs'
import { skipMeta } from '../../helpers/skipMeta'

// service to manage functionalities related with audio
const AudioService = () => ({
  generateAudioData: async (fileBuffer: Buffer) => {
    const buffer = Buffer.alloc(100)
    const bytesRead = fileBuffer.copy(buffer, 0, 0, 100)

    // if the byte size is less than 100 bytes
    if (bytesRead < 100) throw new Error('Error reading data')

    let totalduration = 0
    let totalFrames = 0
    // gets buffer offset by skipping meta if any
    let bufferoffset = skipMeta(buffer)

    while (bufferoffset < fileBuffer.length) {
      const bytes = fileBuffer.copy(buffer, 0, bufferoffset, bufferoffset + 10)

      if (bytes < 10) return { duration: roundToMs(totalduration), totalFrames }

      if (buffer[0] !== 0xff || (buffer[1] & 0xe0) !== 0xe0) {
        bufferoffset++
        continue
      }

      let info = calculateFrameData(buffer)

      if (!info.frameSize || !info.samples) {
        bufferoffset++
        continue
      }

      totalFrames++
      bufferoffset += info.frameSize
      totalduration += info.samples / info.sampleRate
    }

    return { duration: roundToMs(totalduration), frames: totalFrames }
  },
})

export const audioService = AudioService()
