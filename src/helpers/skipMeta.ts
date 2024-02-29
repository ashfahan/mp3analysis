// function to skipMeta if present in buffer and start from offset
export const skipMeta = (buffer: Buffer, offset = 0) => {
  if (buffer[0] !== 73 || buffer[1] !== 68 || buffer[2] !== 51) return offset

  let id3v2 = buffer.at(5)
  let var0 = buffer.at(6)
  let var1 = buffer.at(7)
  let var2 = buffer.at(8)
  let var3 = buffer.at(9)
  let footerSize = id3v2 & 16 ? 10 : 0
  let tagSize: number

  if ((var0 & 128) === 0 && (var1 & 128) === 0 && (var2 & 128) === 0 && (var3 & 128) === 0) {
    tagSize = (var0 & 127) * 2097152 + (var1 & 127) * 16384 + (var2 & 127) * 128 + (var3 & 127)
    return 10 + tagSize + footerSize
  }

  return offset // default reutrn 0
}
