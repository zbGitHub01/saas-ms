import http from '@/api'

export const generateApiFnc = apiConfig => {
  const apis = {}
  Object.keys(apiConfig).forEach(key => {
    const [method, url] = apiConfig[key].split(' ')
    const httpMethod = method.toLowerCase()
    apis[key] = (data, _object) => http[httpMethod](url, data, _object)
  })
  return apis
}
