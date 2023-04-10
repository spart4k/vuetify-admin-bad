import axios from "axios";
import store from '../store';

export default class Cities {
  constructor(url) {
    this.url = url;
  }

  async get() {
    console.log(this.url);
    try {
      const data = await axios.post(`${this.url}getFirstNGenerationsOfChildren`, {
        "n": 3,
        "conditions": {
          "floor": 0,
          "moderation": true
        }
      }).then((response) => {
        return response.data;
      });
      console.log(data);
      if (!data) {
        return [];
      }
  
      return (data || []).map((el) => ({
        id: el.id,
        title: el.name,
        Children: el.Children,
      }));
    } catch(error) {
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
    const newCity = await fetch(`${this.url}admin/cities`, {
      method: "POST",
      body: JSON.stringify(city),
    }).then((response) => response.json());

    if (!newCity) {
      return null;
    }

    return {
      id: newCity.id,
      name: newCity.name,
      latitude: newCity.latitude,
      longitude: newCity.longitude,
    };
  }

  async update(id, service) {
    const { data } = await axios.put(`${this.url}admin/service/${id}`, service, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    console.log(data)
    const newService = data
    if (!newService) {
      return null;
    }

    return newService
  }

  async delete(id) {
    await fetch(`${this.url}admin/city/${id}`, {
      method: "DELETE",
    });
  }
}
