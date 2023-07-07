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
      isDeleting: false,
      isAddingWithTimeout: false,
      currentValue: '',
      selectValue: '',
      hours: '',
      minutes: '',
      substringsData: [[], [], [], ['serviceName', 'date', 'time'], ['date'], ['serviceName', 'time'], ['serviceName', 'date', 'time'], ['rating'], ['masterName', 'serviceName', 'time'], ['masterName', 'date', 'time']],
      currentSubstrings: [],
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    editItem(item) {
      this.isEditing = true
      this.currentValue = item.name
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.currentSubstrings = [...this.substringsData[item.id - 1]]
    },
    newItem() {
      this.dialog = true
      this.isAdding = true
    },

    deleteItem(item) {
      this.dialog = true
      this.isDeleting = true
      this.currentValue = item.name
    },
    insertAtCursor(newText) {
      const el = this.$refs.textareaRef.$el.querySelector('textarea')
      if (el.selectionStart || el.selectionStart == '0') {
        const startPos = el.selectionStart;
        const endPos = el.selectionEnd;
        this.editedItem.text = el.value.substring(0, startPos)
          + newText
          + el.value.substring(endPos, el.value.length)
        const carretPos = startPos + newText.length
        el.focus()
        this.$nextTick(() => {
          el.setSelectionRange(carretPos, carretPos)
        })
      } else {
        this.editedItem.text += newText;
      }
    },

    // async deleteItemConfirm() {
    //   await specializations.delete(this.editedItem.id)
    //   this.dataset.splice(this.editedIndex, 1)
    //   this.closeDelete()
    // },

    close() {
      this.dialog = false
      this.isAdding = false
      this.isEditing = false
      this.isDeleting = false
      this.$nextTick(() => {
        this.clearForm()
        this.currentValue = ''
        this.currentSubstrings = []
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      // this.dataset[this.editedIndex] = this.editedItem
      if (this.isEditing) {
        this.validateEdit()
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
      if (this.isAddingWithTimeout && (this.hours < 0 || this.hours > 23)) {
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
    validateEdit() {
      if (this.currentSubstrings.length > 0) {
        let isError = false
        const matches = this.editedItem.text.match(/[^{}]+(?=})/g)
        matches.forEach(match => {
          if (!this.currentSubstrings.includes(match)) {
            isError = true
            store.commit('alert/show', { type: 'error', content: 'Указан неверный плейсхолдер' })
            return
          }
        });
        if (isError) return
      }
      this.loadingBtn = true
      this.pushEdit()
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