import Vue from 'vue'
import LayoutDefault from '@/layouts/default'
import { appointment } from '@/api'
import VueMask from 'v-mask'
Vue.use(VueMask)

export default {
  name: 'view-appointment',
  components: {
    LayoutDefault
  },  
  async created() {
    this.loading = true
    const appointmentData = await appointment.get(this.search)
    this.dataset = appointmentData
    this.dataset.forEach((item, index) => {
      this.dataset[index].date_slot = item.time_slot
      this.dataset[index].priceCount = 0
      item.Appointment_MasterServices.forEach(item => {
        this.dataset[index].priceCount += item.price
      })
      this.dataset[index].priceArray = item.Appointment_MasterServices
    });
    this.loading = false
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'ID клиента', value: 'client_id' },
        { text: 'ID мастера', value: 'master_id' },
        { text: 'Дата создания', value: 'createdAt' },
        { text: 'Дата изменения', value: 'updatedAt' },
        { text: 'Дата записи', value: 'date_slot', sortable: false },
        { text: 'Время записи', value: 'time_slot', sortable: false },
        { text: 'Услуги', value: 'Appointment_MasterServices', sortable: false },
        { text: 'Цена', value: 'priceCount', sortable: false },
        { text: 'Статус', value: 'status_id', sortable: false },
        { text: 'Действия', value: 'actions', sortable: false, align: 'center' }
      ],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        id: '',
        name: '',
        latitude: '',
        longitude: ''
      },
      defaultItem: {
        id: '',
        name: '',
        latitude: '',
        longitude: ''
      },
      dataset: [],
      search: '',
      loading: true,
      loadingBtn: false,
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
    }
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
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
      await appointment.delete(city)
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
      console.log(id, this.editedItem)
      const updatedCity = await appointment.update(id,this.editedItem)
      this.loadingBtn = false
      if (updatedCity) {
        Vue.set(this.dataset, this.editedIndex, updatedCity)
        this.close()
      }
    },
    async requestCreate () {
      const newCity = await appointment.create({
        city: this.editedItem.name,
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
    formatTime(date) {
      let newDate = (new Date(date)).toTimeString().split(' ')[0].slice(0, -3); 
      return newDate
    },
  }
}