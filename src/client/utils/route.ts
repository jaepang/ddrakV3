import qs from 'query-string'
import { isEmptyObject } from './object'

export function getParameterizedPath(
  path: string,
  params?: { [param: string]: any },
  queryParams?: { [queryParam: string]: any },
): string {
  const queryString = isEmptyObject(queryParams) ? '' : `?${qs.stringify(queryParams)}`

  if (isEmptyObject(params)) {
    return `${path}${queryString}`
  }

  return Object.keys(params).reduce((prevValue, curValue) => {
    return `${prevValue.replace(`[${curValue}]`, params[curValue])}${queryString}`
  }, path)
}
