import axios from 'axios'
import { showSnackbar } from '../stores/NotificationStore.tsx'
import { getCookie } from 'cookies-next'
import { NAMESPACE } from './constant'

export default function httpConfig() {
  axios.defaults.baseURL = 'https://faaz-be.herokuapp.com'
  // axios.defaults.baseURL = 'http://localhost:3001'
  axios.defaults.headers.common.Authorization =
      'bearer ' + getCookie(`${NAMESPACE}_TOKEN`)
  axios.interceptors.response.use(
    function (response) {
      return response
    },
    async function (error) {
      var err = error.message
      var title = 'Warning'
      var msgData = {
        message: err,
      }
      if (error.response) {
        if(error.response.status === 401) window.location.pathname = '/account/login'
        if (error.response.data) {
          msgData = error.response.data
        }
      }

      showSnackbar({...msgData, variant: 'error'})
    }
  )
}
