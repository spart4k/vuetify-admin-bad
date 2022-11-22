import axios from "axios";
import store from '../store';
export default class Feeds {
  constructor(url) {
    this.url = url;
  }

  async get() {
    try {
      const { data } = await axios(`${this.url}admin/profile/reviews`)
      console.log(data)
      console.log(data)
      if (!data || data.reviews.length === 0) {
        store.commit('alert/show', { type: 'warning', content: `В данный момент городов нет` })
        return [];
      }
  
      return data.reviews
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
      const { data } = await axios.post(`${this.url}admin/cities`, city)
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

  async update(id, city) {
    try {
      const { data } = await axios.put(`${this.url}admin/city/${id}?name=${city.name}`)
      console.log(data)
      const updatedCity = data.city[0]
      store.commit('alert/show', { type: 'success', content: `Город успешно изменен на ${city.name}`, duration: 2000 })
      if (!updatedCity) {
        return null;
      }
      console.log(updatedCity)
      return {
        id: updatedCity.id,
        name: updatedCity.name,
        latitude: updatedCity.location.coordinates[0],
        longitude: updatedCity.location.coordinates[1],
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

  async delete(city) {
    try {
      const response = await axios.delete(`${this.url}admin/city/${city.id}`);
      console.log(response)
      store.commit('alert/show', { type: 'success', content: `Город: ${city.name} успешно удален`, duration: 2000 })
    } catch(error) {
      const errorText = error.message
      store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }
    
  }
}
