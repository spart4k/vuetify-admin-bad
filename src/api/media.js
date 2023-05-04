import axios from "axios";
import store from '../store';
export default class Cities {
  constructor(url) {
    this.url = url;
  }

  async add(params) {
    console.log(params)
    try {
      console.log(params)
      const formData = new FormData()
      for (var key in params) {
        formData.append(key, params[key]);
      }
      const { data } = await axios.post(`files/api/addFile`, formData)
      return data
      //const newCity = data
      //store.commit('alert/show', { type: 'success', content: `Город ${newCity.name} успешно добавлен`, duration: 2000 })
      //if (!newCity) {
      //  return null;
      //}

      //return {
      //  id: newCity.id,
      //  name: newCity.name,
      //  latitude: newCity.latitude,
      //  longitude: newCity.longtitude,
      //};
    } catch(error) {
      console.log(error)
      //let errorText = ''
      //if (error?.response?.data?.message?.name) errorText = error?.response?.data?.message?.name
      //else if (error?.response?.data?.message) errorText = error?.response?.data?.message
      //else {
      //  errorText = error.message
      //}
      //store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }


  }

  async delete(city) {
    try {
      const response = await axios.delete(`users/api/admin/delCityId?city_id=${city.id}`);
      console.log(response)
      store.commit('alert/show', { type: 'success', content: `Город: ${city.name} успешно удален`, duration: 2000 })
    } catch(error) {
      const errorText = error.message
      store.commit('alert/show', { type: 'error', content: `Ошибка: ${errorText}` })
    }

  }
}
