import axios from "axios";
import store from '../store';

export default class Cities {
  constructor(url) {
    this.url = url;
  }

  async get() {
    console.log(this.url);
    try {
      const data = await axios(`${this.url}admin/services`).then((response) => {
        return response.data;
      });
      console.log(data);
      if (!data) {
        return [];
      }
  
      return (data?.services || []).map((el) => ({
        id: el.id,
        title: el.title,
        chapter_categories: el.Chapter_Categories,
        chapter_classes: el.Chapter_Classes,
        img: el.img
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

  async update(id, city) {
    const updatedCity = await fetch(`${this.url}admin/city/${id}`, {
      method: "PUT",
      body: JSON.stringify(city),
    }).then((response) => response.json());

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

  async delete(id) {
    await fetch(`${this.url}admin/city/${id}`, {
      method: "DELETE",
    });
  }
}
