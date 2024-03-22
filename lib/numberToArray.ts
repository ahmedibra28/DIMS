export const numberToArray = (number: number) => {
  return Array.from({ length: number }, (_, i) => i + 1)
}
