import http from '@/api'

export const generateApiFnc = apiConfig => {
  const apis = {}
  Object.keys(apiConfig).forEach(key => {
    const [method, url] = apiConfig[key].split(' ')
    const httpMethod = method.toLowerCase()
    apis[key] = (data, rest) => http[httpMethod](url, data, rest)
  })
  return apis
}
