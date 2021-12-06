import axios from 'axios';

export default function httpConfig() {
  axios.defaults.baseURL = 'https://faaz-be.herokuapp.com/v1'
  //axios.defaults.baseURL = 'http://localhost:3001'
}
