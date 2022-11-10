export default class Chapters {
  constructor(url) {
    this.url = url;
  }

  async get() {
    const data = await fetch(`${this.url}admin/chapters`).then((response) => {
      response.json();
    });

    if (!data) {
      return [];
    }

    return (data?.chapters || []).map((el) => ({
      id: el.id,
      title: el.title,
      img: el.img,
      classes_title: el.classes_title,
    }));
  }

  async create(chapter) {
    const newChapter = await fetch(`${this.url}admin/chapter`, {
      method: "POST",
      body: JSON.stringify(chapter),
    }).then((response) => response.json());

    if (!newChapter) {
      return null;
    }

    return {
      id: newChapter.id,
      title: newChapter.title,
      img: newChapter.img,
      classes_title: newChapter.classes_title,
    };
  }

  async update(id, chapter) {
    const updatedChapter = await fetch(`${this.url}admin/chapter/${id}`, {
      method: "PUT",
      body: JSON.stringify(chapter),
    }).then((response) => response.json());

    if (!updatedChapter) {
      return null;
    }

    return {
      id: updatedChapter.id,
      title: updatedChapter.title,
      img: updatedChapter.img,
      classes_title: updatedChapter.classes_title,
    };
  }

  async delete(id) {
    await fetch(`${this.url}admin/chapter/${id}`, {
      method: "DELETE",
    });
  }
}
