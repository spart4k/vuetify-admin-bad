import axios from "axios";
import store from '../store';
export default class Clients {
  constructor(url) {
    this.url = url;
  }

  async get() {
    try {
      const { data } = await axios.post(`users/api/admin/getProfileMasters`, {
        "email": "",
        "phone": "",
        "page": 1,
        "count": 99999
      })
      console.log(data)
      if (!data || data.length === 0) {
        store.commit('alert/show', { type: 'warning', content: `В данный момент городов нет` })
        return [];
      }
  
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

  async create(city) {
    console.log(city)
    try {
      const { data } = await axios.post(`users/api/admin/cities`, city)
      const newCity = data.city
      store.commit('alert/show', { type: 'success', content: `Город ${newCity.name} успешно добавлен`, duration: 2000 })
      if (!newCity) {
        return null;
      }
  
      return {
        id: newCity.id,
        name: newCity.name,
        latitude: newCity.location.coordinates[0],
        longitude: newCity.location.coordinates[1],
      };
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

  async update(id, master) {
    try {
      const { data } = await axios.patch(`users/api/admin/editProfileMaster/?user_id=${id}`, master)
      console.log(data)
      const updatedCity = data.city[0]
      store.commit('alert/show', { type: 'success', content: `Мастер успешно обновлён`, duration: 2000 })
      if (!updatedCity) {
        return null;
      }
      console.log(updatedCity)
      return { updatedCity };
    } catch(error) {
      console.log(error)
      // let errorText = ''
      // if (error?.response?.data?.message?.name) errorText = error?.response?.data?.message?.name
      // else if (error?.response?.data?.message) errorText = error?.response?.data?.message
      // else {
      //   errorText = error.message
      // }
      // store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }
    
  }

  async delete(city) {
    try {
      const response = await axios.delete(`users/api/admin/city/${city.id}`);
      console.log(response)
      store.commit('alert/show', { type: 'success', content: `Город: ${city.name} успешно удален`, duration: 2000 })
    } catch(error) {
      const errorText = error.message
      store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }
    
  }
  
  async getSpecializations() {
    try {
      const { data } = await axios.get(`users/api/admin/getSpecializations`)
      if (!data || data.length === 0) {
        store.commit('alert/show', { type: 'warning', content: `В данный момент специализайций нет` })
        return [];
      }
  
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
