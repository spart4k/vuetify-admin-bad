<template>
  <div class="">
    <div v-for="chapter in dataset" :key="chapter.id">
      <v-card :title="chapter.title">
        <v-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">Название класса</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in chapter.classes" :key="item.id">
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
import {chapters, classes} from "../api";

export default {
  name: "ViewClasses",
  async created() {
    const chaptersData = await chapters.get();

    // eslint-disable-next-line
    for (let chapterData of chaptersData) {
      // eslint-disable-next-line
      const classesData = await classes.get(chapterData.id)
      chapterData.classes = classesData;
    }

    this.dataset = chaptersData;
  },
  data() {
    return {
      dataset: [],
    };
  },
};

/*
<template>
  <v-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Название класса</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="chapter in dataset" :key="chapter.id">
          <tr>
            <th class="text-left">{{ chapter.title }}</th>
          </tr>
          <tr v-for="item in chapter.classes" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
          </tr>
        </template>
      </tbody>
    </template>
  </v-table>
</template>
*/
</script>
