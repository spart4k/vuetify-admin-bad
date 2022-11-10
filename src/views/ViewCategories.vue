<template>
  <div class="">
    <div v-for="chapter in dataset" :key="chapter.id">
      <v-card :title="chapter.title">
        <v-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Название категории</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in chapter.categories" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
              </tr>
            </tbody>
          </template>
        </v-table>
      </v-card>
    </div>
  </div>
</template>

<script>
import { chapters, categories } from "../api";

export default {
  name: "ViewClasses",
  async created() {
    const chaptersData = await chapters.get();

    // eslint-disable-next-line
    for (let chapterData of chaptersData) {
      // eslint-disable-next-line
      const categoriesData = await categories.get(chapterData.id)
      chapterData.categories = categoriesData;
    }

    this.dataset = chaptersData;
  },
  data() {
    return {
      dataset: [],
    };
  },
};
</script>
