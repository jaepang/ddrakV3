// {도메인}_{메시지} 형식으로 코드 매핑
// ex) 도메인 = AUTH, 메시지 = TOKEN_EXPIRED -> AUTH_TOKEN_EXPIRED

export enum ERROR_CODES {
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_NOT_FOUND = 'AUTH_TOKEN_NOT_FOUND',
  UNKNOWN = 'UNKNOWN',
}
