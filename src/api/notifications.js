import axios from "axios";
import store from '../store';
export default class Notifications {
  constructor(url) {
    this.url = url;
  }

  async get() {
    try {
      const { data } = await axios.get(`users/api/admin/getSpecializations`)
      console.log(data)
  
      return data
    } catch(error) {
      console.log(error)
      let errorText = ''
      if (error?.response?.data?.message?.name) errorText = error?.response?.data?.message?.name
      else if (error?.response?.data?.message) errorText = error?.response?.data?.message
      else {
        errorText = error.message
      }
      store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }
  }
}
