/**
 * user service
 * @author yoyoyohamapi
 * @ingore created 2018-08-14 00:01:23
 */
import axios from 'axios'
import { SearchParam } from '@models/user'

export const fetch = (params: SearchParam) =>
  axios.get('https://api.github.com/search/users', {params})
