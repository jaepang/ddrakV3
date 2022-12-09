export function leftPadZero(tar: string | number): string {
  return tar.toLocaleString('en-Us', { minimumIntegerDigits: 2, useGrouping: false })
}
