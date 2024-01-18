export const rollNoGenerator = (
  type: 'student' | 'instructor',
  total: number
) => {
  const prefix = type === 'student' ? 'STD' : 'INS'
  const totalLength = total.toString().length
  const zeros = '0'.repeat(6 - totalLength)
  return `${prefix}${zeros}${total + 1}`
}
