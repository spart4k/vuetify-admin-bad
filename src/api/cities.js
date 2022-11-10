import axios from "axios";
import store from '../store';
export default class Cities {
  constructor(url) {
    this.url = url;
  }

  async get() {
    try {
      const data = await axios(`${this.url}admin/cities`).then((response) => {
        return response.data;
      });
      console.log(data);
      if (!data) {
        return [];
      }
  
      return (data?.cities || []).map((el) => ({
        id: el.id,
        name: el.name,
        latitude: el.latitude,
        longitude: el.longitude,
      }));
    } catch(error) {
      const errorText = error.message
      store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }
  }

  async create(city) {
    console.log(city)
    try {
      const newCity = await axios.post(`${this.url}admin/cities`, city).then((response) => {
        console.log(response)
        store.commit('alert/show', { type: 'success', content: `Город ${response.data.name} успешно добавлен`, duration: 2000 })
        return response.data;
      });
      if (!newCity) {
        return null;
      }
  
      return {
        id: newCity.id,
        name: newCity.name,
        latitude: newCity.latitude,
        longitude: newCity.longitude,
      };
    } catch(error) {
      const errorText = error.message
      store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }
    

  }

  async update(id, city) {
    console.log(city)
    const updatedCity = await axios.put(`${this.url}admin/city/${id}`, city)
    .then((response) => {
      console.log(response)
      return response.data;
    });

    if (!updatedCity) {
      return null;
    }

    return {
      id: updatedCity.id,
      name: updatedCity.name,
      latitude: updatedCity.latitude,
      longitude: updatedCity.longitude,
    };
  }

  async delete(city) {
    try {
      await axios.delete(`${this.url}admin/city/${city.id}`);
      store.commit('alert/show', { type: 'success', content: `Город: ${city.name} успешно удален` })
    } catch(error) {
      const errorText = error.message
      store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }
    
  }
}
