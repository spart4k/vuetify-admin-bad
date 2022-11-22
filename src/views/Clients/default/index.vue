<template>
  <LayoutDefault>
    <div class="">
      <v-card-title>
        Клиенты
      </v-card-title>
      <v-data-table
        multi-sort
        :loading="loading"
        :search="search"
        :items="dataset"
        :headers="headers"
        item-key="id"
        :footerProps="{
          itemsPerPageText: 'Кол-во на странице'
        }"
      >
      <!-- :hide-default-footer="dataset.length <= 10" -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Поиск"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" :max-width="formTitle === 'Изменить' ? '400px' : '400px'">
              <!-- <template v-slot:activator="{ attrs }">
                <v-btn color="#EF8A3E" dark class="mb-2" v-bind="attrs" @click="newItem">
                  Добавить
                </v-btn>
              </template> -->
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
  
                <v-card-text>
                  <v-container>
                    <v-row cols="12" sm="6" md="4">
                      <v-col cols="12" sm="12" :md="formTitle === 'Изменить' ? '12' : '12'">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Имя"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.lastName"
                          label="Фамилия"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.email"
                          label="Почта"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.phoneNumber"
                          label="Телефон"
                        ></v-text-field>
                        <div class="">
                          <v-file-input 
                            v-model="imageChapter"
                            label="Логотип"
                            show-size
                            accept="image/*"
                            prepend-icon="mdi-camera" 
                          />
                          <v-img v-if="urlImage" :src="urlImage" />
                        </div>
                        <!-- <v-date-picker v-model="editedItem.dateOfBirth"></v-date-picker> -->
                      </v-col>
                      <!-- <v-col v-if="formTitle === 'Изменить'" cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.latitude"
                          label="Широта"
                        ></v-text-field>
                      </v-col>
                      <v-col v-if="formTitle === 'Изменить'" cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.longitude"
                          label="Долгота"
                        ></v-text-field>
                      </v-col> -->
                    </v-row>
                  </v-container>
                </v-card-text>
  
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="darken darken-1" text @click="close">
                    Отменить
                  </v-btn>
                  <v-btn disabled color="#EF8A3E" :loading="loadingBtn" text @click="save">
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">
                  Вы хотите удалить город?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">
                    Отмена
                  </v-btn>
                  <v-btn disabled color="red darken-1" text @click="deleteItemConfirm">
                    Удалить
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <!-- <v-icon color="red" small @click="deleteItem(item)">mdi-delete</v-icon> -->
        </template>
        <template v-slot:[`item.emailValidate`]="{ item }">
          <span class="emailValidate" :class="item.emailValidate ? 'active' : 'no-active'">
            <v-icon color="white" v-if="true">
              mdi-account-check
            </v-icon>
            <v-icon color="white" v-else>
              mdi-account-alert
            </v-icon>
          </span>
        </template>
        <template v-slot:[`item.dateOfBirth`]="{ item }">
          {{ formatDate(item.dateOfBirth) }}
        </template>
      </v-data-table>
    </div>
  </LayoutDefault>
</template>
<script src="./script.js"></script>
<style lang="scss" scoped>
.emailValidate {
  padding: .5rem 1rem;
  border-radius: 25px;
  color: #fff;
  &.active {
    background-color: green;
  }
  &.no-active {
    background-color: rgb(194, 52, 52);
  }
}
</style>
