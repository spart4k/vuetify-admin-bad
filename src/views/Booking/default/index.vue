<template>
  <LayoutDefault>
    <div class="">
      <v-card-title>
        Бронирование
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
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
  
                <v-card-text>
                  <v-container>
                    <v-row cols="12" sm="6" md="4">
                      <v-col cols="12" sm="12" :md="formTitle === 'Изменить' ? '12' : '12'">
                        <v-text-field
                          v-model="itemDate"
                          v-mask="'##.##.####'"
                          label="Дата бронирования"
                        ></v-text-field>
                        <v-text-field
                          v-model="itemTime"
                          v-mask="'##:##'"
                          label="Время бронирования"
                        ></v-text-field>
                        <v-select
                          v-model="currentServicesTitles"
                          :items="masterServicesTitles"
                          :menu-props="{ maxHeight: '400' }"
                          label="Услуги"
                          multiple
                          persistent-hint
                        ></v-select>
                        <v-select
                          v-model="itemStatus"
                          :items="['Не начата', 'Отменена', 'Завершена']"
                          :menu-props="{ maxHeight: '400' }"
                          label="Статус"
                          persistent-hint
                        ></v-select>
                      </v-col> 
                    </v-row>
                  </v-container>
                </v-card-text>
  
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="darken darken-1" text @click="close">
                    Отменить
                  </v-btn>
                  <v-btn color="#EF8A3E" :loading="loadingBtn" text @click="save">
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">
                  Вы хотите удалить запись?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">
                    Отмена
                  </v-btn>
                  <v-btn color="red darken-1" text @click="deleteItemConfirm">
                    Удалить
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon v-if="item.status_id !== '2' && item.status_id !== '3'" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon color="red" small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:[`item.emailValidate`]="{ item }">
          <span class="emailValidate" :class="item.emailValidate ? 'active' : 'no-active'">
            <v-icon color="white" v-if="true">
              mdi-account
            </v-icon>
            <v-icon color="white" v-else>
              mdi-account-alert
            </v-icon>
          </span>
        </template>
        <template v-slot:[`item.Appointment_MasterServices`]="{ item }">
          <div v-for="(item, index) in item.Appointment_MasterServices" :key="item.id">
            <br v-if="index !== 0">
            <div>
              {{item.nameService}}
            </div>
          </div>
          {{false ? item.Appointment_MasterServices[0] : ''}}
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ item.createdAt ? formatDate(item.createdAt) : ''}}
        </template>
        <template v-slot:[`item.updatedAt`]="{ item }">
          {{ item.updatedAt && item.updatedAt !== item.createdAt ? formatDate(item.updatedAt) : '' }}
        </template>
        <template v-slot:[`item.time_slot`]="{ item }">
          {{ item.time_slot ? formatTime(item.time_slot) : '' }}
        </template>
        <template v-slot:[`item.date_slot`]="{ item }">
          {{ item.date_slot ? formatDate(item.date_slot) : '' }}
        </template>
        <template v-slot:[`item.status_id`]="{ item }">
          {{ item.status_id === '3' ? 'Завершена' : item.status_id === '2' ? 'Отменена' : 'Не начата' }}
        </template>
      </v-data-table>
    </div>
  </LayoutDefault>
</template>
<script src="./script.js"></script>
