// function to round the duration to nearest mili seconds
export const roundToMs = (duration: number) => {
  return Math.round(duration * 1000) / 1000
}
