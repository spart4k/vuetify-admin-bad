import Vue from 'vue'
import LayoutDefault from '@/layouts/default'
import { clients } from '@/api'
import VueMask from 'v-mask'
Vue.use(VueMask)

export default {
  name: 'view-clients',
  components: {
    LayoutDefault
  },  
  async created() {
    this.loading = true
    const citiesData = await clients.get()
    this.dataset = citiesData
    this.loading = false
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Имя', value: 'name' },
        { text: 'Фамилия', value: 'lastName' },
        { text: 'Email', value: 'email' },
        { text: 'Дата регистрации', value: 'createdAt' },
        { text: 'Дата рождения', value: 'dateOfBirth' },
        { text: 'Телефон', value: 'phoneNumber', sortable: false },
        // { text: 'Подтвержден', value: 'emailValidate', sortable: false, align: 'center' },
        { text: 'Дата изменения', value: 'updatedAt', sortable: false },
        { text: 'Действия', value: 'actions', sortable: false, align: 'center' }
      ],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      newConvertedDateBirth: '',
      editedItem: {
        id: '',
        name: '',
        email: '',
        lastName: '',
        dateOfBirth: ''
      },
      defaultItem: {
        id: '',
        name: '',
        email: '',
        lastName: '',
        dateOfBirth: ''
      },
      dataset: [],
      search: '',
      loading: true,
      loadingBtn: false,
      imageChapter: null,
      urlImage: ''
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Добавить' : 'Изменить'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    imageChapter(val) {
      if (val) {
        this.urlImage = URL.createObjectURL(val);
      } else {
        this.urlImage = null
      }
    },
    editedIndex() {
      if (this.editedItem.avatarUrl) {
        this.urlImage = this.editedItem.avatarUrl
      } else {
        this.urlImage = null
      }
    } 
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log(Object.assign({}, item))
      this.newConvertedDateBirth = this.formatDate(Object.assign({}, item).dateOfBirth)
      this.dialog = true
    },
    newItem () {
      console.log('new')
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      const city = {
        id: this.editedItem.id,
        name: this.editedItem.name
      }
      await clients.delete(city)
      this.dataset.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      // this.dataset[this.editedIndex] = this.editedItem
      if (this.formTitle === 'Изменить') {
        this.requestEdit()
      } else if (this.formTitle === 'Добавить') {
        this.requestCreate()
      }
      this.loadingBtn = true
      
      // this.close()
    },
    onlyNumber ($event) {
      //console.log($event.keyCode); //keyCodes value
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
          $event.preventDefault();
      }
    },
    async requestEdit () {
      const id = this.editedItem.id
      this.editedItem.dateOfBirth = this.newConvertedDateBirth.split('.').reverse().join('-') + 'T00:00:00.000Z'
      const requestData = {
        "email": this.editedItem.email,
        "name": this.editedItem.name,
        "last_name": this.editedItem.lastName,
        "birth_day": this.editedItem.dateOfBirth
      }
      const updatedClient = await clients.update(id, requestData)
      this.loadingBtn = false
      if (updatedClient) {
        Vue.set(this.dataset, this.editedIndex, this.editedItem)
        this.close()
      }
    },
    async requestCreate () {
      const newCity = await clients.create({
        name: this.editedItem.name,
        // latitude: +this.editedItem.latitude,
        // longitude: +this.editedItem.longitude
      })
      this.loadingBtn = false
      if (newCity) {
        this.dataset.push(newCity)
        this.close()
      }
      
    },
    showAlert(content, type, duration) {
      this.alert.state = true
      this.alert.type = type
      this.alert.content = content
      if (duration) {
        setTimeout(() => {
          this.alert.state = false
        }, duration)
      }
    },
    updateOptions(options) {
      console.log('update')
      console.log(options)
    },
    padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    },
    formatDate(date) {
      let newDate = new Date(date)
      const yyyy = newDate.getFullYear();
      let mm = newDate.getMonth() + 1; // Months start at 0!
      let dd = newDate.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      const formattedToday = dd + '.' + mm + '.' + yyyy;
      return formattedToday
    },
  }
}