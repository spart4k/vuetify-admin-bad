import Vue from 'vue'
import LayoutDefault from '@/layouts/default'
import { masters } from '@/api'
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
    mastersData.forEach((item) => {
      if (item.birth_day) {
        item.birth_day_converted = new Date(item.birth_day).toLocaleString("ru", {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          timezone: 'UTC'
        })
      }
    })
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
        { text: 'Дата регистрации', value: 'createdAt' },
        { text: 'Дата рождения', value: 'birth_day'},
        { text: 'Телефон', value: 'phone_number', sortable: false },
        { text: 'О себе', value: 'about_me', sortable: false },
        { text: 'Специализация', value: 'Specialisations', sortable: false },
        { text: 'Курсы', value: 'Courses', sortable: false },
        { text: 'Дипломы', value: 'Diploms', sortable: false },
        { text: 'Образование', value: 'Educations', sortable: false },
        { text: 'Подтвержден', value: 'moderation', align: 'center' },
        { text: 'Дата изменения', value: 'updatedAt' },
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
      newConvertedDateBirth: '',
      convertedCourseStart: [],
      convertedCourseEnd: [],
      changeStage: 1,
      coursesStage: 1,
      diplomsStage: 1,
      educationsStage: 1,
      allSpecialisations: [],
      allSpecialisationsTitle: [],
      currentSpecialisationsTitle: []
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
    editItem(item) {
      this.changeStage = 1
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.convertedCourseStart = []
      this.convertedCourseEnd = []
      this.newConvertedDateBirth = this.formatDate(Object.assign({}, item).birth_day)
      this.editedItem.Courses.forEach(item => {
        this.convertedCourseStart.push(this.formatDate(item.start_date))
        this.convertedCourseEnd.push(this.formatDate(item.end_date))
      })
      this.currentSpecialisationsTitle = []
      this.editedItem.Specialisations.forEach(item => {
        this.currentSpecialisationsTitle.push(item.title)
      })
      this.dialog = true
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
    async requestEdit () {
      if (this.changeStage === 1) {
      this.editedItem.dateOfBirth = this.newConvertedDateBirth.split('.').reverse().join('-') + 'T00:00:00.000Z'
      const requestData = {
        "email": this.editedItem.email,
        "name": this.editedItem.name,
        "last_name": this.editedItem.last_name,
        "birth_day": this.editedItem.dateOfBirth,
        "about_me": this.editedItem.about_me,
        "moderation": this.editedItem.moderation
      }
        await masters.update(this.editedItem.id, requestData)
      } else if (this.changeStage === 2) {
        const specArray = []
        this.currentSpecialisationsTitle.forEach(item => {
          this.allSpecialisations.forEach(spec => {
            if (item === spec.title) {
              specArray.push(spec.id)
            }
          });
        })
        const requestData = {
          "user_id": this.editedItem.id,
          "specialization_ids": specArray
        }
        await masters.overWriteSpecializationMaster(requestData)
      } else if (this.changeStage === 3) {
        const requestData = {
          "name": this.editedItem.Courses[this.coursesStage - 1].name,
          "description": this.editedItem.Courses[this.coursesStage - 1].description,
          "start_date": `${this.convertedCourseStart[this.coursesStage - 1].split('.').reverse().join('-')}T00:00:00.000Z`,
          "end_date": this.editedItem.Courses[this.coursesStage - 1].till_now ? null : `${this.convertedCourseEnd[this.coursesStage - 1].split('.').reverse().join('-')}T00:00:00.000Z`,
          // "till_now": this.editedItem.Courses[this.coursesStage - 1].till_now ? this.editedItem.Courses[this.coursesStage - 1].till_now : false
        }
        await masters.editCourseMaster(requestData, this.editedItem.Courses[this.coursesStage - 1].id)
      } else if (this.changeStage === 4) {
        const requestData = {
          "title": this.editedItem.Diploms[this.diplomsStage - 1].title,
        }
        await masters.editDiplomMaster(requestData, this.editedItem.Diploms[this.diplomsStage - 1].id)
      } else if (this.changeStage === 5) {
        const requestData = {
          "school_name": this.editedItem.Educations[this.educationsStage - 1].school_name,
          "faculty": this.editedItem.Educations[this.educationsStage - 1].faculty,
          "specialization": this.editedItem.Educations[this.educationsStage - 1].specialization,
          "end_year": Number(this.editedItem.Educations[this.educationsStage - 1].end_year)
        }
        await masters.editEducationMaster(requestData, this.editedItem.Educations[this.educationsStage - 1].id)
      }
      const mastersData = await masters.get()
      this.dataset = mastersData
      console.log(this.editedItem)
      this.loadingBtn = false
      // if (updatedCity) {
      //   Vue.set(this.dataset, this.editedIndex, updatedCity)
      //   this.close()
      // }
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