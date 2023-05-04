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
        { text: 'Дата бронирования', value: 'date_slot', sortable: false },
        { text: 'Время бронирования', value: 'time_slot', sortable: false },
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
      itemStatus: '',
      itemTime: '',
      itemDate: '',
      masterServices: [],
      masterServicesTitles: [],
      currentServicesTitles: [],
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
    async editItem(item) {
      this.masterServices = []
      this.masterServicesTitles = []
      this.currentServicesTitles = []
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.Appointment_MasterServices.forEach(item => {
        this.currentServicesTitles.push(item.nameService)
      })
      const status = this.editedItem.status_id
      if (status === '1') {
        this.itemStatus = 'Не начата'
      } else if (status === '2') {
        this.itemStatus = 'Отменена'
      } else if (status === '3') {
        this.itemStatus = 'Завершена'
      }
      this.itemDate = this.formatDate(Object.assign({}, item).date_slot)
      this.itemTime = this.formatTime(Object.assign({}, item).time_slot)
      const appointmentMaster = await appointment.getMaster(this.editedItem.master_id)
      appointmentMaster.Workspaces.forEach(item => {
        item.Intervals.forEach(item => {
          item.MasterServices.forEach(item => {
            if (!this.masterServicesTitles.includes(item.Service.name)) {
              this.masterServices.push(item.Service)
              this.masterServicesTitles.push(item.Service.name)
            }
          })
        });
      })
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
      await appointment.delete(this.editedItem.id)
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
    async requestEdit() {
      const masterServices = [] 
      let status = 1
      const time = `${this.itemDate.split('.')[2]}-${this.itemDate.split('.')[1]}-${this.itemDate.split('.')[0]}T${this.itemTime}:00.000Z`
      console.log(this.itemDate, this.itemTime)
      if (this.itemStatus === 'Не начата') {
        status = 1
      } else if (this.itemStatus === 'Отменена') {
        status = 2
      } else if (this.itemStatus === 'Завершена') {
        status = 3
      }
      this.currentServicesTitles.forEach(itemName => {
        this.masterServices.forEach(item => {
          console.log(itemName, this.masterServices)
          if (itemName === item.name) {
            masterServices.push(item.id)
          }
        })
      })
      const requestData = {
        "time_slot": time,
        "masterServices": masterServices.length ? masterServices : undefined,
        "status_id": status,
      }
      console.log(requestData)
      const updatedAppointment = await appointment.update(requestData, this.editedItem.id)
      this.loadingBtn = false
      if (updatedAppointment) {
        Vue.set(this.dataset, this.editedIndex, updatedAppointment)
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