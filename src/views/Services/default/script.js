// import Vue from 'vue'
import LayoutDefault from '@/layouts/default'
import { categories, classes, services, media } from '@/api'
import { v4 as uuidv4 } from 'uuid';

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
      imageChapterIcon: null,
      fileImageChapter: null,
      fileImageChapterIcon: null,
      dialogClass: false,
      choosedServiceClasses: null,
      selectedItem: {},
      dialogDeleteClass: false,
      dialogDeleteCategories: false,
      urlImageChapter: '',
      urlImageChapterIcon: '',
      formTitle: '',
      newImageChapterId: '',
      newImageChapterIconId: '',
      includeImageChapter: null,
      includeImageChapterIcon: null,
      urlImageIconForDelete: null,
      urlImageForDelete: null
    }
  },
  computed: {
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
        let img = new Image();
        let objectUrl = URL.createObjectURL(val);
        //this.urlImageChapterIcon = URL.createObjectURL(val);
        let vm = this;
        //var re = /(?:\.([^.]+))?$/;
        img.onload = async function () {
          if (this.width < this.height) {
            vm.urlImageChapter = objectUrl
            var blob = val.slice(0, val.size, val.type);
            let imageType = ''
            if (val.type === 'image/jpeg') {
              imageType = 'jpg'
            } else if (val.type === 'image/png') {
              imageType = 'png'
            }

            let newFile = new File([blob], `${uuidv4()}.${imageType}`, {type: val.type});
            console.log(newFile)
            vm.fileImageChapter = newFile
          } else {
            this.imageChapter = null
            vm.$store.commit('alert/show', { type: 'error', content: `Изображение должно быть вертикальным`, duration: 2000 })
          }
        };
        img.src = objectUrl;
      } else {
        this.urlImageChapter = null
      }
    },
    imageChapterIcon(val) {
      if (val) {
        let img = new Image();
        let objectUrl = URL.createObjectURL(val);
        //this.urlImageChapterIcon = URL.createObjectURL(val);
        let vm = this;
        img.onload = function () {
            //if (this.width/this.height === 1) {
              vm.urlImageChapterIcon = objectUrl
              //vm.fileImageChapterIcon = val
              var blob = val.slice(0, val.size, val.type);
              let imageType = ''
              if (val.type === 'image/jpeg') {
                imageType = 'jpg'
              } else if (val.type === 'image/png') {
                imageType = 'png'
              }
              let newFile = new File([blob], `${uuidv4()}_icon.${imageType}`, {type: val.type});
              vm.fileImageChapterIcon = newFile
              console.log(newFile)
            //} else {
              //vm.$store.commit('alert/show', { type: 'error', content: `Изображение должно быть в формате 1:1`, duration: 2000 })
            //}
        };
        img.src = objectUrl;
      } else {
        this.urlImageChapterIcon = null
      }
    },
    editedIndex() {
      if (this.editedItem.Files.length) {
        this.editedItem.Files.forEach((item) => {
          if (item.url.includes('_icon')) {
            this.urlImageChapterIcon = item.url
            let splitedImage = item.url.split('/')
            console.log(splitedImage)
            this.urlImageIconForDelete = splitedImage[splitedImage.length-2] + '/' + splitedImage[splitedImage.length-1]
            this.fileImageChapterIcon = item
            this.includeImageChapterIcon = true
            this.createFileFromUrl(item.url)
          } else {
            this.urlImageChapter = item.url
            let splitedImage = item.url.split('/')
            console.log(splitedImage)
            this.urlImageForDelete = splitedImage[splitedImage.length-2] + '/' + splitedImage[splitedImage.length-1]
            this.fileImageChapter = item
            this.includeImageChapter = true
          }
        })
      } else {
        this.urlImageChapter = null
        this.includeImageChapter = null
        this.urlImageChapterIcon = null
        this.includeImageChapterIcon = null
      }

    },
    //editedIndex() {
    //  if (this.editedItem.Files.length) {
    //    this.editedItem.Files.forEach((item) => {
    //      if (item.url.includes('_icon')) {
    //        this.urlImageChapterIcon = item.url
    //        this.fileImageChapterIcon = item
    //        this.includeImageChapter = true
    //        this.createFileFromUrl(item.url)
    //      } else {
    //        this.urlImageChapter = item.url
    //        this.fileImageChapter = item
    //        this.includeImageChapterIcon = true
    //      }
    //    })
    //  } else {
    //    this.urlImageChapter = null
    //    this.includeImageChapter = null
    //    this.urlImageChapterIcon = null
    //    this.includeImageChapterIcon = null
    //  }

    //},
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
    editItem(item) {
      console.log(item)
      this.formTitle = 'Изменить'
      //this.editedIndex = this.dataset.indexOf(item)
      this.editedIndex = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      // this.dialogClass = true
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
    newItem() {
      this.formTitle = 'Добавить'
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.dataset.indexOf(item)
      this.editedItem = Object.assign({}, item)
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
      await services.delete(this.editedItem.id)
      await this.getItems()
      // this.dataset.splice(this.editedIndex, 1)
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
      this.urlImageChapter = null
      this.urlImageChapterIcon = null
      this.includeImageChapter = null
      this.includeImageChapterIcon = null
      this.fileImageChapter = null
      this.fileImageChapterIcon = null
      this.urlImageIconForDelete = null
      this.urlImageForDelete = null
      this.imageChapter = null
      this.imageChapterIcon = null
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
      // const id = this.editedItem.id
      let formData = {
        id: this.editedItem.id,
        name: this.editedItem.name,
        is_category: this.editedItem.is_category,
        floor: this.editedItem.floor,
        parent_id: this.editedItem.parent_id,
        title_over_children: this.editedItem.title_over_children ? this.editedItem.title_over_children : '',
        path: this.editedItem.path,
        added_files: [],
        deletedFiles: [],
        moderation: this.editedItem.moderation ? this.editedItem.moderation : false
      }
      console.log(this.urlImageChapterIcon instanceof Blob)
      if (this.editedItem.floor < 2 && this.urlImageChapter && this.urlImageChapter.includes('blob:')) {
        // imageChapter
        const result = await media.add({
          dir: "imageServices",
          name: this.fileImageChapter.name,
          image: this.fileImageChapter,
          avatar: false
        })
        this.newImageChapterId = result.id
        console.log(result)
        formData.added_files.push(result.id)
      }
      if (this.editedItem.floor < 2 && this.urlImageChapterIcon && this.urlImageChapterIcon.includes('blob:')) {
        // urlImageChapterIcon
        const result = await media.add({
          dir: "imageServices",
          name: this.fileImageChapterIcon.name,
          image: this.fileImageChapterIcon,
          avatar: false
        })
        this.fileImageChapterIcon = result.id
        console.log(result)
        formData.added_files.push(result.id)
      }
      if (this.editedItem.floor < 2 && !this.urlImageChapter && this.includeImageChapter) {
        const result = await media.delete(this.urlImageForDelete)
        console.log(result)
      }
      if (this.editedItem.floor < 2 && !this.urlImageChapterIcon && this.includeImageChapterIcon) {
        const result = await media.delete(this.urlImageIconForDelete)
        console.log(result)
      }
      //if (this.editedItem.)
      console.log(formData)
      const updatedChapter = await services.create(formData)
      console.log(updatedChapter)
      this.loadingBtn = false
      await this.getItems()
      this.close()
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
      console.log('!!', this.selectedItem)
      let isCategory
      let floor
      let parentId
      let parentPath
      if (Object.keys(this.selectedItem).length === 0) {
        isCategory = true
        floor = 0
        parentId = null
        parentPath = ','
      } else if (Object.keys(this.selectedItem).length) {
        parentId = this.selectedItem.id
        parentPath = `,${this.selectedItem.id}${this.selectedItem.path}`
        isCategory = true
        floor = this.selectedItem.floor + 1
        if (floor === 4) {
          isCategory = false
        }
      }
      let formData = {
        name: this.editedItem.name,
        is_category: isCategory,
        floor: floor,
        parent_id: parentId,
        path: parentPath,
        title_over_children: this.editedItem.title_over_children ? this.editedItem.title_over_children : '',
        added_files: [],
        deletedFiles: [],
        moderation: this.editedItem.moderation ? this.editedItem.moderation : false
      }
      if (this.selectedItem.floor < 2 && this.urlImageChapter && this.urlImageChapter.includes('blob:')) {
        // imageChapter
        const result = await media.add({
          dir: "imageServices",
          name: this.fileImageChapter.name,
          image: this.fileImageChapter,
          avatar: false
        })
        this.newImageChapterId = result.id
        console.log(result)
        formData.added_files.push(result.id)
      }
      if (this.selectedItem.floor < 2 && this.urlImageChapterIcon && this.urlImageChapterIcon.includes('blob:')) {
        // urlImageChapterIcon
        const result = await media.add({
          dir: "imageServices",
          name: this.fileImageChapterIcon.name,
          image: this.fileImageChapterIcon,
          avatar: false
        })
        this.fileImageChapterIcon = result.id
        console.log(result)
        formData.added_files.push(result.id)
      }
      console.log(formData)
      const newChapter = await services.create(formData)
      this.loadingBtn = false
      if (newChapter) {
        this.closeClass()
        this.getItems()
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
      this.formTitle = 'Добавить'
      console.log(service)
      if (service) {
        this.selectedItem = service
        this.choosedServiceClasses = service.id
      } else {
        this.selectedItem = {}
        this.choosedServiceClasses = 0
      }
      this.dialogClass = true
    },
    addCategories(service) {
      console.log('categories')
      this.choosedServiceClasses = service.id
      this.dialogCategories = true
    },
    closeClass() {
      this.dialogClass = false
      this.urlImageChapter = null
      this.urlImageChapterIcon = null
      // this.$nextTick(() => {
      //   this.editedItemClass = Object.assign({}, this.defaultItem)
      //   this.editedIndexClass = -1
      // })
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
    },

    removeImageChapter() {
      this.urlImageChapter = null
      this.fileImageChapter = null
      this.imageChapter = null
    },

    removeImageChapterIcon() {
      this.urlImageChapterIcon = null
      this.fileImageChapterIcon = null
      this.imageChapterIcon = null
    },
    createFileFromUrl(url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'blob';
      request.onload = function() {
          var reader = new FileReader();
          reader.readAsDataURL(request.response);
          reader.onload =  function(e){
              console.log('DataURL:', e.target.result);
          };
      };
      request.send();
    }
  }
}