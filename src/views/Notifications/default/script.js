// import Vue from 'vue'
import LayoutDefault from '@/layouts/default'
import {notifications} from '@/api'
import store from '@/store'
import Vue from 'vue'

export default {
    name: 'view-notifications',
    components: {
        LayoutDefault
    },
    async created() {
        this.loading = true
        this.dataset = await notifications.get()
        this.loading = false
    },
    data() {
        return {
            headers: [
                {text: 'ID', value: 'id'},
                {text: 'Название уведомления', value: 'name'},
                {text: 'Текст уведомления', value: 'text'},
                {text: 'Действия', value: 'actions', sortable: false, align: 'center'}
            ],
            dialog: false,
            editedIndex: -1,
            editedItem: {
                id: '',
                name: '',
                text: '',
                type: '',
            },
            newItemData: {
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
            selectValue: 'все',
            hours: '00',
            minutes: '00',
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
            this.editedItem = Object.assign({}, item)
        },

        insertAtCursor(newText) {
            const el = this.$refs.textareaRef.$el.querySelector('textarea')
            if (el.selectionStart || el.selectionStart === '0') {
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
            if (this.isEditing) {
                this.validateEdit()
            } else if (this.isAdding) {
                this.validateCreate()
            } else if (this.isDeleting) {
                this.deleteItemConfirm()
            }
        },

        clearForm() {
            this.isAddingWithTimeout = false
            this.selectValue = 'все'
            this.hours = ''
            this.minutes = ''
            this.newItemData = Object.assign({}, this.defaultItem)
        },

        validateCreate() {
            if (this.newItemData.name.length  <= 0) {
                store.commit('alert/show', {
                    type: 'error',
                    content: 'Название уведомления не должно быть пустым'
                })
                return
            }
            if (this.newItemData.text.length > 80) {
                store.commit('alert/show', {
                    type: 'error',
                    content: 'Текст уведомления должен быть не более 80 символов'
                })
                return
            }
            if (!this.selectValue) {
                store.commit('alert/show', {type: 'error', content: 'Не выбран тип пользователей'})
                return
            }
            if (this.isAddingWithTimeout && !(this.getHours(this.hours) >= 0 && this.getHours(this.hours) < 23)) {
                store.commit('alert/show', {
                    type: 'error',
                    content: 'Количество часов должно быть в диапазоне от 0 до 23'
                })
                return
            }
            if (this.isAddingWithTimeout && !(this.getMinutes(this.minutes) >= 0 && this.getMinutes(this.minutes) < 59)) {
                store.commit('alert/show', {
                    type: 'error',
                    content: 'Количество минут должно быть в диапазоне от 0 до 59'
                })
                return
            }
            this.loadingBtn = true
            this.notificationCreate()
        },
        validateEdit() {
            if (this.currentSubstrings.length > 0) {
                let isError = false
                const matches = this.editedItem.text.match(/[^{}]+(?=})/g)
                matches.forEach(match => {
                    if (!this.currentSubstrings.includes(match)) {
                        isError = true
                        store.commit('alert/show', {type: 'error', content: 'Указан неверный плейсхолдер'})
                    }
                });
                if (isError) return
            }
            this.loadingBtn = true
            this.notificationEdit()
        },
        async notificationEdit() {
            const requestData = {
                "id": this.editedItem.id,
                "type": this.editedItem.type,
                "text": this.editedItem.text
            }
            const updatedNotification = await notifications.update(requestData)
            this.editedItem.moderation = false
            this.loadingBtn = false
            if (updatedNotification) {
                Vue.set(this.dataset, this.editedIndex, this.editedItem)
                this.close()
            }
        },
        async notificationCreate() {
            const requestData = {
                "name": this.newItemData.name,
                "text": this.newItemData.text,
                "timeout": this.getTimout(),
                "userRole": this.getUserRole(),
            }
            await notifications.create(requestData)
            this.loadingBtn = false
            this.close()
            this.dataset = await notifications.get()
        },
        async deleteItemConfirm() {
            const requestData = {
                "id": this.editedItem.id,
            }
            await notifications.delete(requestData)
            this.loadingBtn = false
            this.close()
            this.dataset = await notifications.get()
        },
        getUserRole() {
            if (this.selectValue === "мастера") {
                return 1;
            } else if (this.selectValue === "клиенты") {
                return 2;
            } else {
                return 4;
            }
        },
        getTimout() {
            const hours = this.getHours();
            const minutes = this.getMinutes();
            return (hours * 60 + minutes) * 60 * 1000;
        },
        getHours() {
            return parseFloat(this.hours)
        },
        getMinutes() {
            return parseFloat(this.minutes)
        }
    }
}
