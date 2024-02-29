import { BITRATES, LAYERS, SAMPLERATES, SAMPLESDATA, VERSIONS } from '../utils/constants'
import { calculateFrameSize } from './calculateFrameSize'

export const calculateFrameData = (buffer: Buffer): Record<string, any> => {
  const [_, var1, var2] = buffer

  const versionIndex = (var1 & 24) >> 3
  const version = VERSIONS[versionIndex]
  const versionNumber = version === '2.5' ? 2 : version

  const layerIndex = (var1 & 6) >> 1
  const layer = LAYERS[layerIndex]

  const bitRateType = 'V' + versionNumber + 'L' + layer
  const bitRateIndex = (var2 & 240) >> 4
  const bitRate = BITRATES[bitRateType][bitRateIndex] || 0

  const sampleRateIndex = (var2 & 12) >> 2
  const sampleRate = SAMPLERATES[version][sampleRateIndex] || 0
  const samples = SAMPLESDATA[versionNumber][layer]

  const padding = (var2 & 2) >> 1

  return {
    bitRate,
    sampleRate,
    frameSize: calculateFrameSize(samples, layer, bitRate, sampleRate, padding),
    samples: samples,
  }
}
