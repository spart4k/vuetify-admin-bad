export default class ChapterClass {
  constructor(url) {
    this.url = url;
  }

  async get(chapterId) {
    const data = await fetch(
      `${this.url}admin/chapters/${chapterId}/classes`
    ).then((response) => response.json());

    if (!data) {
      return [];
    }

    return (data.classes || []).map((el) => ({
      id: el.id,
      title: el.title,
    }));
  }

  async create(chapterId, chapterClass) {
    const newClass = await fetch(
      `${this.url}/api/admin/chapters/${chapterId}/classes`,
      {
        method: "POST",
        body: JSON.stringify(chapterClass),
      }
    ).then((response) => response.json());

    if (!newClass) {
      return null;
    }

    return {
      id: newClass.id,
      title: newClass.title,
    };
  }

  async update(chapterId, classId, classData) {
    const updatedChapterClass = await fetch(
      `${this.url}admin/chapters/${chapterId}/classes/${classId}`,
      {
        method: "PUT",
        body: JSON.stringify(classData),
      }
    ).then((response) => response.json());

    if (!updatedChapterClass) {
      return null;
    }

    return {
      id: updatedChapterClass.id,
      title: updatedChapterClass.title,
    };
  }

  async delete(chapterId, classId) {
    await fetch(`${this.url}admin/chapters/${chapterId}/classes/${classId}`, {
      method: "DELETE",
    });
  }
}
