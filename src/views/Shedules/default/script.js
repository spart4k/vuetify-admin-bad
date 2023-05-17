import Vue from 'vue'
import LayoutDefault from '@/layouts/default'
import { masters, shedules } from '@/api'
import VueMask from 'v-mask'
Vue.use(VueMask)

export default {
  name: 'view-clients',
  components: {
    LayoutDefault
  },  
  async created() {
    this.loading = true
    const mastersData = await masters.get()
    this.dataset = mastersData
    this.loading = false
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Имя', value: 'name' },
        { text: 'Фамилия', value: 'last_name' },
        { text: 'Email', value: 'email' },
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
      imageChapter: null,
      urlImage: null,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      arrayEvents: [],
      fullEvents: [],
      shedulesType: 1,
      dayOfWeek: 1,
      regularSchedule: [{intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}],
      flexSchedule: {interval: '', workspace_id: null, services: [], express: false, name: ''},
      workspaceFullArray: [],
      workspaceNameArray: [],
      servicesFullArray: [],
      servicesNameArray: [],
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
    },
    changeStage() {
      if (this.changeStage === 2 && !this.allSpecialisationsTitle.length) {
        this.getAllSpec()
      }
    }
  },
  methods: {
    async editItem(item) {
      this.shedulesType = 1
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      // const mastersShedulesDataDay = await shedules.getDay()
      // console.log(mastersShedulesDataDay)
      if (this.editedItem.regularSchedule) {
        if (this.editedItem.regularSchedule.intervals.length === 7) {
          this.regularSchedule = this.editedItem.regularSchedule?.intervals
        } else {
        this.regularSchedule = [{intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}]
        }
      } else {
        this.regularSchedule = [{intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}, {intervals: [], workspace_id: null, services: [], express: false}]
      }
      this.regularSchedule.forEach((item, index) => {
        if (!item) {
          this.regularSchedule[index] = {
            intervals: [],
            workspace_id: null,
            services: [],
            express: false
          }
        } else {
          if (item?.intervals) {
            item?.intervals?.forEach((item, number) => {
              if (item.length) {
                let I1 = item.split('-')[0].split(':')[0]
                let I2 = item.split('-')[0].split(':')[1]
                let I3 = item.split('-')[1].split(':')[0]
                let I4 = item.split('-')[1].split(':')[1]
                if (I1.length !== 2) {
                  I1 = `0${I1}`
                }
                if (I2.length !== 2) {
                  I2 = `${I2}0`
                }
                if (I3.length !== 2) {
                  I3 = `0${I3}`
                }
                if (I4.length !== 2) {
                  I4 = `${I4}0`
                }
                this.regularSchedule[index].intervals[number] = `${I1}:${I2}-${I3}:${I4}`
              }
            });
          }
        }
      });
      this.arrayEvents = []
      this.fullEvents = []
      this.workspaceFullArray = []
      this.workspaceNameArray = []
      this.servicesFullArray = []
      this.servicesNameArray = []
      this.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      await this.getFullShedules()
      await this.getServices()
      await this.getWorkspace()
      this.dialog = true
    },

    async getServices() {
      const requestData = {
        "user_id": this.editedItem.id,
        "searchField": '',
        "path": ',',
        "count": 99999,
        "page": 1,
      }
      const masterServices = await shedules.getServices(requestData)
      masterServices.Services.forEach(item => {
        this.servicesNameArray.push(item.Service.name)
        this.servicesFullArray.push(item)
      });
      this.regularSchedule.forEach((item, index) => {
        item.services.forEach((service, id) => {
          this.servicesFullArray.forEach(globalService => {
            if (service === globalService.id) {
              this.regularSchedule[index].services[id] = globalService.Service.name
            }
          })
        });
      });
    },

    async getWorkspace() {
      const requestData = {
        "master_id": this.editedItem.id,
        "count": 99999,
        "page": 1,
      }
      const masterWorkspace = await shedules.getWorkspace(requestData)
      masterWorkspace.Workspace.forEach(item => {
        this.workspaceNameArray.push(item.address)
        this.workspaceFullArray.push(item)
      });
      this.regularSchedule.forEach((item, index) => {
        this.workspaceFullArray.forEach(workspace => {
          if (item.workspace_id === workspace.id) {
            this.regularSchedule[index].workspace_name = workspace.address
          }
        });
      });
    },

    async getFullShedules() {
      const currentMonthIndex = new Date().getMonth() + 1
      let currentYearIndex = new Date().getFullYear()
      for (let i = 0; i < 7; i++) {
        let month = currentMonthIndex + i
        if (month > 12) {
          month -= 12
          currentYearIndex += 1
        }
        const mastersShedulesDataMonth = await shedules.getMonth(this.editedItem.id, month, currentYearIndex)
        if (mastersShedulesDataMonth.shedulesMonth.length || i === 0) {
          mastersShedulesDataMonth.shedulesMonth.forEach(item => {
            if (!this.arrayEvents.includes(item.date.split('T')[0])) {
              this.arrayEvents.push(item.date.split('T')[0])
              this.fullEvents.push(item)
            }
          });
        } else {
          break
        }
      }
    },

    newItem () {
      console.log('new')
      this.dialog = true
    },

    async getAllSpec() {
      const allSpec = await masters.getSpecializations()
      this.allSpecialisations = allSpec
      this.allSpecialisations.forEach(item => {
        this.allSpecialisationsTitle.push(item.title)
      })
    },

    deleteItem (item) {
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      await masters.delete(this.editedItem.id)
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
      // регулярный
      if (this.shedulesType === 1) {
        const newSchedule = Object.assign({}, this.regularSchedule)
        newSchedule.forEach((item, index) => {
          if (!item.intervals.length || !item.services.length || !item.workspace_id) {
            newSchedule[index] = null
          } else {
            this.workspaceFullArray.forEach(workspace => {
              if (item.workspace_name === workspace.address) {
                newSchedule[index].workspace_id = workspace.id
              }
            })
            item.services.forEach((service, id) => {
              this.servicesFullArray.forEach(globalService => {
                if (service === globalService.Service.name) {
                  newSchedule[index].services[id] = globalService.id
                }
              })
            });
            // item.intervals.forEach((interval, id) => {
            //   if (interval.length !== 11) {
            //     newSchedule[index].interval[id].splice(id, 1)
            //   }
            // });
            delete newSchedule[index].workspace_name
          }
        });
        const requestData = {
          "intervals": newSchedule,
          "user_id": this.editedItem.id
        }
        const newDate = new Date(new Date().setMonth(new Date().getMonth() + 3))
        console.log(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate(), requestData)
        await shedules.updateRegular(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate(), requestData)
        // гибкий
      } else if (this.shedulesType === 2) {
        let newSchedule = Object.assign({}, this.flexSchedule)
        this.workspaceFullArray.forEach(workspace => {
          if (newSchedule.workspace_name === workspace.address) {
            newSchedule.workspace_id = workspace.id
          }
        })
        newSchedule.services.forEach((service, id) => {
          this.servicesFullArray.forEach(globalService => {
            if (service === globalService.Service.name) {
              newSchedule.services[id] = globalService.id
            }
          })
        });
        delete newSchedule.workspace_name
        const requestData = {
          "intervals": [newSchedule],
          "user_id": this.editedItem.id
        }
        await shedules.updateFlex(this.date.split('-')[0], this.date.split('-')[1], this.date.split('-')[2], requestData)
      }
      this.loadingBtn = false
      this.close()
    },
    async deleteMasterInfo() {
      if (this.changeStage === 3) {
        await masters.delCourseMaster(this.editedItem.Courses[this.coursesStage - 1].id)
        this.editedItem.Courses.splice(this.coursesStage - 1, 1)
        this.changeStage = 1
      } else if (this.changeStage === 4) {
        await masters.delDiplomMaster(this.editedItem.Diploms[this.diplomsStage - 1].id)
        this.editedItem.Diploms.splice(this.diplomsStage - 1, 1)
        this.changeStage = 1
      } else if (this.changeStage === 5) {
        await masters.deleteEducation(this.editedItem.Educations[this.educationsStage - 1].id)
        this.editedItem.Educations.splice(this.educationsStage - 1, 1)
        this.changeStage = 1
      }
      this.loadingBtn = false
    },
    async requestCreate () {
      const newCity = await masters.create({
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