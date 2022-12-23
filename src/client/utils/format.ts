export function leftPadZero(tar: string | number): string {
  return tar.toLocaleString('ko-kr', { minimumIntegerDigits: 2, useGrouping: false })
}
