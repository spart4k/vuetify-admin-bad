import Vue from 'vue'
import LayoutDefault from '@/layouts/default'
import {cities} from '@/api'

export default {
    name: 'view-cities',
    components: {
        LayoutDefault
    },
    async created() {
        this.loading = true
        const citiesData = await cities.get(this.search)
        this.dataset = citiesData
        this.loading = false
    },
    data() {
        return {
            headers: [
                {text: 'ID', value: 'id'},
                {text: 'Название', value: 'name'},
                {text: 'Широта', value: 'latitude'},
                {text: 'Долгота', value: 'longitude'},
                {text: 'Действия', value: 'actions', sortable: false, align: 'center'}
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
        formTitle() {
            return this.editedIndex === -1 ? 'Добавить' : 'Изменить'
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        }
    },
    methods: {
        editItem(item) {
            this.editedIndex = this.dataset.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        newItem() {
            console.log('new')
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.dataset.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm() {
            const city = {
                id: this.editedItem.id,
                name: this.editedItem.name
            }
            await cities.delete(city)
            this.dataset.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            // this.dataset[this.editedIndex] = this.editedItem
            if (this.formTitle === 'Изменить') {
                this.requestEdit()
            } else if (this.formTitle === 'Добавить') {
                this.requestCreate()
            }
            this.loadingBtn = true

            // this.close()
        },
        onlyNumber($event) {
            //console.log($event.keyCode); //keyCodes value
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
                $event.preventDefault();
            }
        },
        async requestEdit() {
            const id = this.editedItem.id
            console.log(id, this.editedItem)
            const updatedCity = await cities.update(id, this.editedItem)
            this.loadingBtn = false
            if (updatedCity) {
                Vue.set(this.dataset, this.editedIndex, updatedCity)
                this.close()
            }
        },
        async requestCreate() {
            const newCity = await cities.create({
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
        }
    }
}
