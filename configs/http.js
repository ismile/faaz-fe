import axios from 'axios';

export default function httpConfig() {
  axios.defaults.baseURL = 'https://faaz-be.herokuapp.com/v1'
}
