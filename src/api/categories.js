export default class ChapterCategories {
  constructor(url) {
    this.url = url;
  }

  async get(chapterId) {
    const data = await fetch(
      `${this.url}admin/chapters/${chapterId}/categories`
    ).then((response) => response.json());

    return (data?.category || []).map((el) => ({
      id: el.id,
      title: el.title,
    }));
  }

  async create(chapterId, categoryData) {
    const newCategory = await fetch(
      `${this.url}/api/admin/chapters/${chapterId}/categories`,
      {
        method: "POST",
        body: JSON.stringify(categoryData),
      }
    ).then((response) => response.json());

    if (!newCategory) {
      return null;
    }

    return {
      id: newCategory.id,
      title: newCategory.title,
    };
  }

  async update(chapterId, classId, categoryData) {
    const updatedChapterCategory = await fetch(
      `${this.url}admin/chapters/${chapterId}/categories/${classId}`,
      {
        method: "PUT",
        body: JSON.stringify(categoryData),
      }
    ).then((response) => response.json());

    if (!updatedChapterCategory) {
      return null;
    }

    return {
      id: updatedChapterCategory.id,
      title: updatedChapterCategory.title,
    };
  }

  async delete(chapterId, categoryId) {
    await fetch(
      `${this.url}admin/chapters/${chapterId}/categories/${categoryId}`,
      {
        method: "DELETE",
      }
    );
  }
}
