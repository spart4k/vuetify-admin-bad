// import Vue from 'vue'
import LayoutDefault from '@/layouts/default'
// import { notifications } from '@/api'
import pushDataJson from './test_data.json'
import store from '@/store'

export default {
  name: 'view-specializations',
  components: {
    LayoutDefault
  },
  async created() {
    this.loading = true
    // const pushData = await notifications.get()
    const pushData = await new Promise((res) => {
      setTimeout(() => {
        res(pushDataJson)
      }, 1000);
    })
    this.dataset = pushData
    this.loading = false
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Название уведомления', value: 'name' },
        { text: 'Текст уведомления', value: 'text' },
        { text: 'Действия', value: 'actions', sortable: false, align: 'center' }
      ],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        id: '',
        name: '',
        text: '',
      },
      newItemData: {
        id: '',
        name: '',
        text: '',
      },
      defaultItem: {
        id: '',
        name: '',
        text: '',
      },
      dataset: [],
      loading: true,
      loadingBtn: false,
      isAdding: false,
      isEditing: false,
      isAddingWithTimeout: false,
      selectValue: '',
      hours: '',
      minutes: '',
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Добавить' : 'Изменить'
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    // dialogDelete(val) {
    //   val || this.closeDelete()
    // },
  },
  methods: {
    editItem(item) {
      this.isEditing = true
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    newItem() {
      this.dialog = true
      this.isAdding = true
    },

    // deleteItem(item) {
    //   this.editedIndex = this.dataset.indexOf(item)
    //   this.editedItem = Object.assign({}, item)
    //   this.dialogDelete = true
    // },

    // async deleteItemConfirm() {
    //   await specializations.delete(this.editedItem.id)
    //   this.dataset.splice(this.editedIndex, 1)
    //   this.closeDelete()
    // },

    close() {
      this.dialog = false
      this.isAdding = false
      this.isEditing = false
      this.$nextTick(() => {
        this.clearForm()
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    // closeDelete() {
    //   this.dialogDelete = false
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem)
    //     this.editedIndex = -1
    //   })
    // },

    save() {
      // this.dataset[this.editedIndex] = this.editedItem
      if (this.isEditing) {
        this.pushEdit()
      } else if (this.isAdding) {
        this.validateCreate()
      }

      // this.close()
    },
    clearForm() {
      this.isAddingWithTimeout = false
      this.selectValue = ''
      this.hours = ''
      this.minutes = ''
      this.newItemData = Object.assign({}, this.defaultItem)
    },
    validateCreate() {
      if (this.newItemData.text.length > 80) {
        store.commit('alert/show', { type: 'error', content: 'Текст уведомления должен быть не более 80 символов' })
        return
      }
      if (!this.selectValue) {
        store.commit('alert/show', { type: 'error', content: 'Не выбран тип пользователей' })
        return
      }
      if (this.isAddingWithTimeout && !this.hours) {
        store.commit('alert/show', { type: 'error', content: 'Не указано количество часов' })
        return
      }
      if (this.isAddingWithTimeout && !this.minutes) {
        store.commit('alert/show', { type: 'error', content: 'Не указано количество минут' })
        return
      }
      if (this.isAddingWithTimeout && !this.minutes) {
        store.commit('alert/show', { type: 'error', content: 'Не указано количество минут' })
        return
      }
      if (this.isAddingWithTimeout && (this.hours < 0 || this.hours > 23) ) {
        store.commit('alert/show', { type: 'error', content: 'Количество часов должно быть в диапазоне от 0 до 23' })
        return
      }
      if (this.isAddingWithTimeout && (this.minutes < 0 || this.minutes > 59)) {
        store.commit('alert/show', { type: 'error', content: 'Количество минут должно быть в диапазоне от 0 до 59' })
        return
      }
      this.loadingBtn = true
      this.pushCreate()
    },
    async pushEdit() {
      // const requestData = {
      //   "title": this.editedItem.title,
      // }
      // const updatedClient = await specializations.update(this.editedItem.id, requestData)
      // this.editedItem.moderation = false
      // this.loadingBtn = false
      // if (updatedClient) {
      //   Vue.set(this.dataset, this.editedIndex, this.editedItem)
      //   this.close()
      // }
    },
    async pushCreate() {
      // const requestData = {
      //   "title": this.editedItem.title,
      // }
      // await specializations.create(requestData)
      // const citiesData = await specializations.get()
      // this.dataset = citiesData
      // this.loadingBtn = false
      // this.close()
    },
  }
}