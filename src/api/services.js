import axios from "axios";
export default class Cities {
  constructor(url) {
    this.url = url;
  }

  async get() {
    console.log(this.url);
    const data = await axios(`${this.url}admin/services`).then((response) => {
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
