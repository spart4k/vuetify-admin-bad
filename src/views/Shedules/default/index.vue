<template>
  <LayoutDefault>
    <div class="">
      <v-card-title>
        Расписание
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
            <v-dialog v-model="dialog" :max-width="'80%'">
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
  
                <v-card-text>
                  <v-container>
                    <v-row cols="12" sm="6" md="4">
                      <v-col cols="12" sm="12" :md="formTitle === 'Изменить' ? '12' : '12'">
                        <v-date-picker
                          v-model="date"
                          full-width
                          class="mt-4"
                          show-adjacent-months
                          :events="arrayEvents"
                          :event-color="date => !fullEvents[arrayEvents.indexOf(date)].is_regular ? '#292929' : '#EF8A3E'"
                          locale="ru"
                        ></v-date-picker>
                        <!-- {{date}} -->
                        <!-- <v-text-field
                          v-model="editedItem.name"
                          label="Имя"
                        ></v-text-field> -->
                      </v-col>
                    </v-row>
                    <v-row cols="12" sm="6" md="4">
                      <v-btn :disabled="shedulesType === 1" @click="shedulesType = 1" color="#EF8A3E" text>
                        Регулярный график
                      </v-btn>
                      <v-btn :disabled="shedulesType === 2" @click="shedulesType = 2" color="#EF8A3E" text>
                        Гибкий график
                      </v-btn>
                    </v-row>
                    <v-row v-if="shedulesType === 1" cols="12" sm="6" md="4">
                      <v-btn :disabled="dayOfWeek === 1" @click="dayOfWeek = 1" color="#EF8A3E" text>
                        Понедельник
                      </v-btn>
                      <v-btn :disabled="dayOfWeek === 2" @click="dayOfWeek = 2" color="#EF8A3E" text>
                        Вторник
                      </v-btn>
                      <v-btn :disabled="dayOfWeek === 3" @click="dayOfWeek = 3" color="#EF8A3E" text>
                        Среда
                      </v-btn>
                      <v-btn :disabled="dayOfWeek === 4" @click="dayOfWeek = 4" color="#EF8A3E" text>
                        Четверг
                      </v-btn>
                      <v-btn :disabled="dayOfWeek === 5" @click="dayOfWeek = 5" color="#EF8A3E" text>
                        Пятница
                      </v-btn>
                      <v-btn :disabled="dayOfWeek === 6" @click="dayOfWeek = 6" color="#EF8A3E" text>
                        Суббота
                      </v-btn>
                      <v-btn :disabled="dayOfWeek === 0" @click="dayOfWeek = 0" color="#EF8A3E" text>
                        Воскресенье
                      </v-btn>
                    </v-row>
                    <template v-if="shedulesType === 1">
                      <v-text-field
                        v-model="regularSchedule[dayOfWeek].intervals[0]"
                        v-mask="'##:##-##:##'"
                        label="Интервал"
                      ></v-text-field>
                      <v-text-field
                        v-if="regularSchedule[dayOfWeek].intervals[0]?.length === 11"
                        v-model="regularSchedule[dayOfWeek].intervals[1]"
                        v-mask="'##:##-##:##'"
                        label="Интервал"
                      ></v-text-field>
                      <v-text-field
                        v-if="regularSchedule[dayOfWeek].intervals[1]?.length === 11"
                        v-model="regularSchedule[dayOfWeek].intervals[2]"
                        v-mask="'##:##-##:##'"
                        label="Интервал"
                      ></v-text-field>
                      <v-text-field
                        v-if="regularSchedule[dayOfWeek].intervals[2]?.length === 11"
                        v-model="regularSchedule[dayOfWeek].intervals[3]"
                        v-mask="'##:##-##:##'"
                        label="Интервал"
                      ></v-text-field>
                      <v-text-field
                        v-if="regularSchedule[dayOfWeek].intervals[3]?.length === 11"
                        v-model="regularSchedule[dayOfWeek].intervals[4]"
                        v-mask="'##:##-##:##'"
                        label="Интервал"
                      ></v-text-field>
                      <v-text-field
                        v-if="regularSchedule[dayOfWeek].intervals[4]?.length === 11"
                        v-model="regularSchedule[dayOfWeek].intervals[5]"
                        v-mask="'##:##-##:##'"
                        label="Интервал"
                      ></v-text-field>
                      <v-select
                        v-model="regularSchedule[dayOfWeek].workspace_name"
                        :items="workspaceNameArray"
                        :menu-props="{ maxHeight: '400' }"
                        label="Рабочее место"
                        persistent-hint
                      ></v-select>
                      <v-select
                        v-model="regularSchedule[dayOfWeek].services"
                        :items="servicesNameArray"
                        :menu-props="{ maxHeight: '400' }"
                        label="Специализация"
                        multiple
                        persistent-hint
                      ></v-select>
                      <v-checkbox
                        v-model="regularSchedule[dayOfWeek].express"
                        color="orange"
                        :label="'Экспресс'"
                        hide-details
                      ></v-checkbox>
                    </template>
                    <template v-if="shedulesType === 2">
                      <v-text-field
                        v-model="date"
                        readonly
                        label="Дата"
                      ></v-text-field>
                      <v-text-field
                        v-model="flexSchedule.interval"
                        v-mask="'##:##-##:##'"
                        label="Интервал"
                      ></v-text-field>
                      <v-text-field
                        v-model="flexSchedule.name"
                        label="Название"
                      ></v-text-field>
                      <v-select
                        v-model="flexSchedule.workspace_name"
                        :items="workspaceNameArray"
                        :menu-props="{ maxHeight: '400' }"
                        label="Рабочее место"
                        persistent-hint
                      ></v-select>
                      <v-select
                        v-model="flexSchedule.services"
                        :items="servicesNameArray"
                        :menu-props="{ maxHeight: '400' }"
                        label="Специализация"
                        multiple
                        persistent-hint
                      ></v-select>
                      <v-checkbox
                        v-model="flexSchedule.express"
                        color="orange"
                        :label="'Экспресс'"
                        hide-details
                      ></v-checkbox>
                    </template>
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
      </v-data-table>
    </div>
  </LayoutDefault>
</template>
<script src="./script.js"></script>
<style lang="scss" scoped>
  .v-date-picker-table {
    height: 250px;
  }
</style>
