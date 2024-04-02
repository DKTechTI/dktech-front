export default {
  meEndpoint: '/users',
  loginEndpoint: '/auth/login',
  storageUserDataKeyName: 'userId',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
