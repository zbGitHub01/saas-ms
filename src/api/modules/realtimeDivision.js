import http from '../index'
import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {}

const apis = generateApiFnc(apiConfig)

export default apis
