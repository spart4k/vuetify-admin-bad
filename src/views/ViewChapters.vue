<template>
  <v-table>
    <template v-slot:default>
      <thead>
      <tr>
        <th class="text-left">ID</th>
        <th class="text-left">Название</th>
        <th class="text-left">URL картинки</th>
        <th class="text-left">Приписка для классов</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in dataset" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.img }}</td>
        <td>{{ item.classes_title }}</td>
      </tr>
      </tbody>
    </template>
  </v-table>
</template>

<script lang="js">
import {defineComponent} from 'vue'
import {chapters} from '@/api'

export default defineComponent({
  name: 'ViewChapters',
  async created() {
    this.dataset = await chapters.get()
  },
  data() {
    return {
      dataset: [],
    }
  },
})
</script>
