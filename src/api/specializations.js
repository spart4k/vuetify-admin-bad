import axios from "axios";
import store from '../store';
export default class Specializations {
  constructor(url) {
    this.url = url;
  }

  async get() {
    try {
      const { data } = await axios.get(`users/api/admin/getSpecializations`)
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

  async getMaster(id) {
    try {
      const { data } = await axios.get(`users/api/getUserPageById?user_id=${id}`)
      return data
    } catch(error) {
      console.log(error)
    }
  }

  async create(city) {
    console.log(city)
    try {
      const { data } = await axios.post(`users/api/admin/addCity`, city)
      const newCity = data.createCity
      store.commit('alert/show', { type: 'success', content: `Город ${newCity.name} успешно добавлен`, duration: 2000 })
      if (!newCity) {
        return null;
      }
  
      return {
        id: newCity.id,
        name: newCity.name,
        latitude: newCity.latitude,
        longitude: newCity.longtitude,
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

  async update(requestData, id) {
    try {
      const { data } = await axios.patch(`http://94.103.84.93:5000/appointment/api/admin/editAppointmentUser?appointment_id=${id}`, requestData)
      console.log(data)
      const updatedCity = data
      store.commit('alert/show', { type: 'success', content: `Запись успешно изменена`, duration: 2000 })
      return updatedCity
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

  async delete(id) {
    try {
      const response = await axios.delete(`appointment/api/admin/delAppointmentUser?appointment_id=${id}`);
      console.log(response)
      store.commit('alert/show', { type: 'success', content: `Запись успешно удалена`, duration: 2000 })
    } catch(error) {
      const errorText = error.message
      store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }
    
  }
}
