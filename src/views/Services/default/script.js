// import Vue from 'vue'
import LayoutDefault from '@/layouts/default'
import { categories, chapters, classes, services } from '@/api'

export default {
  name: 'view-services',
  components: {
    LayoutDefault
  },  
  async created() {
    await this.getItems()
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', sortable: false  },
        { text: 'Название', value: 'name', sortable: false  },
        // { text: 'Действие', sortable: false  },
        // { text: 'Логотип', value: 'img' },
        // { text: 'Название', value: 'actions', sortable: false },
        // { text: '', value: 'data-table-expand' }
      ],
      dialog: false,
      dialogDelete: false,
      dialogCategories: false,
      editedIndex: -1,
      editedIndexClass: -1,
      editedIndexCategories: -1,
      editedItemClass: {
        id: '',
        title: '',
      },
      editedItemCategories: {
        id: '',
        title: '',
      },
      editedItem: {
        name: '',
        title_over_children: '',
        img: ''
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
      expand: true,
      expands: [],
      imageChapter: null,
      dialogClass: false,
      choosedServiceClasses: null,
      dialogDeleteClass: false,
      dialogDeleteCategories: false,
      urlImage: ''
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Добавить' : 'Изменить'
    },
    formTitleClass () {
      return this.editedIndexClass === -1 ? 'Добавить' : 'Изменить'
    },
    formTitleCategories () {
      return this.editedIndexCategories === -1 ? 'Добавить' : 'Изменить'
    },
    pageTitle() {
      return this.$router.history.current
    }
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
      if (this.editedItem.img) {
        this.urlImage = this.editedItem.img
      } else {
        this.urlImage = null
      }
    } 
  },
  methods: {
    async getItems() {
      this.loading = true
      const citiesData = await services.get()
      console.log(citiesData)
      console.log(this.expands)
      this.dataset = citiesData
      this.loading = false
    },
    editItem (item) {
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    editClass(classes) {
      console.log(classes)
      this.editedIndexClass = classes.id
      this.editedItemClass = Object.assign({}, classes)
      this.dialogClass = true
    },
    editCategories (categories) {
      console.log(categories)
      this.editedIndexCategories = categories.id
      this.editedItemCategories = Object.assign({}, categories)
      this.dialogCategories = true
    },
    newItem () {
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log(item)
      this.dialogDelete = true
    },
    deleteItemClass (classes) {
      console.log(classes)
      this.editedIndexClass = classes.id
      this.editedItemClass = Object.assign({}, classes)
      this.dialogDeleteClass = true
    },
    deleteItemCategories (categories) {
      console.log(categories)
      this.editedIndexCategories = categories.id
      this.editedItemCategories = Object.assign({}, categories)
      this.dialogDeleteCategories = true
    },
    async deleteItemConfirm () {
      const chapter = {
        id: this.editedItem.id,
        name: this.editedItem.title
      }
      console.log(chapter)
      await chapters.delete(chapter)
      this.dataset.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    async deleteItemClassConfirm () {
      console.log(this.editedItemClass)
      const response = await classes.delete(this.editedItemClass.chapter_id, this.editedItemClass)
      console.log(response)
      if (response) {
        this.closeDeleteClass()
        await this.getItems()
      }
      // this.dataset.splice(this.editedIndex, 1)
      
    },
    async deleteItemCategoriesConfirm () {
      console.log(this.editedItemCategories)
      const response = await categories.delete(this.editedItemCategories.chapter_id, this.editedItemCategories)
      console.log(response)
      if (response) {
        this.closeDeleteCategories()
        await this.getItems()
      }
      // this.dataset.splice(this.editedIndex, 1)
      
    },
    closeDeleteClass() {
      this.dialogDeleteClass = false
    },
    closeDeleteCategories() {
      this.dialogDeleteCategories = false
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
      console.log(id)
      let formData = new FormData()
      formData.append('title', this.editedItem.title)
      formData.append('classes_title', this.editedItem.classes_title)
      if (this.imageChapter) {
        formData.append('image', this.imageChapter)
      } else {
        const blob = await fetch(this.editedItem.img, { mode: 'no-cors' }).then(r => r.blob());
        formData.append('image', blob)
        console.log(blob)
      }
      
      const updatedChapter = await chapters.update(id,formData)
      console.log(updatedChapter)
      this.loadingBtn = false
      await this.getItems()
      this.close()
      // if (updatedCity) {
      //   Vue.set(this.dataset, this.editedIndex, updatedCity)
      //   this.close()
      // }
    },
    async requestEditClass () {
      const id = this.editedItemClass.chapter_id
      const updatedClass = await classes.update(id,this.editedItemClass)
      if (updatedClass) {
        this.loadingBtn = false
        this.closeClass()
        await this.getItems()
      }
      console.log(updatedClass)
    },
    async requestEditCategories () {
      console.log('edit cat')
      const id = this.editedItemCategories.chapter_id
      const updatedClass = await categories.update(id,this.editedItemCategories)
      if (updatedClass) {
        this.loadingBtn = false
        this.closeClass()
        await this.getItems()
      }
      console.log(updatedClass)
    },
    async requestCreate () {
      console.log(this.editedItem)
      let isCategory = true
      // formData.append('image', this.imageChapter)
      let formData = {
        name: this.editedItem.name,
        is_category: isCategory,
        floor: 0,
        parent_id: null,
        title_over_children: this.editedItem.title_over_children,
        path: ",",
        added_files: []
      }
      console.log('1')
      const newChapter = await services.create(formData)
      console.log('2')
      this.loadingBtn = false
      if (newChapter) {
        this.dataset.push(newChapter)
        this.close()
      }
      
    },
    async requestCreateClass() {
      console.log(this.editedItemClass, this.editedItem)
      const body = {
        title: this.editedItemClass.title
      }
      const idService = this.choosedServiceClasses
      console.log(body, idService)
      // const newClass = await classes.create(body,idService)
      // console.log(newClass)
      // this.loadingBtn = false
      // if (newClass) {
      //   // this.dataset.push(newClass)
      //   this.getItems()
      //   this.closeClass()
      // }
    },
    async requestCreateCategories () {
      const body = {
        title: this.editedItemCategories.title
      }
      console.log(this.editedItemCategories)
      const idService = this.choosedServiceClasses
      console.log(body, idService)
      const newClass = await categories.create(body,idService)
      console.log(newClass)
      this.loadingBtn = false
      if (newClass) {
        // this.dataset.push(newClass)
        this.getItems()
        this.closeCategories()
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
    addClass(service) {
      console.log('class')
      this.choosedServiceClasses = service.id
      this.dialogClass = true
    },
    addCategories(service) {
      console.log('categories')
      this.choosedServiceClasses = service.id
      this.dialogCategories = true
    },
    closeClass() {
      this.dialogClass = false
      this.$nextTick(() => {
        this.editedItemClass = Object.assign({}, this.defaultItem)
        this.editedIndexClass = -1
      })
    },
    closeCategories() {
      this.dialogCategories = false
      this.$nextTick(() => {
        this.editedItemCategories = Object.assign({}, this.defaultItem)
        this.editedIndexCategories = -1
      })
    },
    saveClass() {
      if (this.formTitleClass === 'Изменить') {
        this.requestEditClass()
      } else if (this.formTitleClass === 'Добавить') {
        this.requestCreateClass()
      }
      this.loadingBtn = true
    },
    saveCategories() {
      console.log()
      if (this.formTitleCategories === 'Изменить') {
        this.requestEditCategories()
      } else if (this.formTitleCategories === 'Добавить') {
        this.requestCreateCategories()
      }
      this.loadingBtn = true
    },
    async createFile(url){
      let response = await fetch(url);
      let data = await response.blob();
      console.log(data)
      let metadata = {
        type: 'image/jpeg'
      };
      let file = new File([data], "test.jpg", metadata);
      return file
      // ... do something with the file or return it
    }
  }
}