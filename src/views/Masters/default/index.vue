<template>
  <LayoutDefault>
    <div class="">
      <v-card-title>
        Мастера
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
            <v-dialog v-model="dialog" persistent :max-width="'55%'">
              <!-- <template v-slot:activator="{ attrs }">
                <v-btn color="#EF8A3E" dark class="mb-2" v-bind="attrs" @click="newItem">
                  Добавить
                </v-btn>
              </template> -->
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-title>
                  <v-btn :disabled="changeStage === 1" @click="changeStage = 1" color="#EF8A3E" text>
                    Общая информация
                  </v-btn>
                  <v-btn :disabled="changeStage === 2" @click="changeStage = 2" color="#EF8A3E" text>
                    Специализация
                  </v-btn>
                  <v-btn v-if="editedItem?.Courses?.length" :disabled="changeStage === 3" @click="changeStage = 3"
                         color="#EF8A3E" text>
                    Курсы
                  </v-btn>
                  <v-btn v-if="editedItem?.Diploms?.length" :disabled="changeStage === 4" @click="changeStage = 4"
                         color="#EF8A3E" text>
                    Дипломы
                  </v-btn>
                  <v-btn v-if="editedItem?.Educations?.length" :disabled="changeStage === 5" @click="changeStage = 5"
                         color="#EF8A3E" text>
                    Образование
                  </v-btn>
                </v-card-title>
                <v-card-title v-if="changeStage === 3">
                  <v-btn v-for="(item, index) in editedItem.Courses" :key="item.id"
                         :disabled="coursesStage === index + 1" @click="coursesStage = index + 1" color="#EF8A3E" text>
                    {{ item.name }}
                  </v-btn>
                </v-card-title>
                <v-card-title v-if="changeStage === 4">
                  <v-btn v-for="(item, index) in editedItem.Diploms" :key="item.id"
                         :disabled="diplomsStage === index + 1" @click="diplomsStage = index + 1" color="#EF8A3E" text>
                    {{ item.title }}
                  </v-btn>
                </v-card-title>
                <v-card-title v-if="changeStage === 5">
                  <v-btn v-for="(item, index) in editedItem.Educations" :key="item.id"
                         :disabled="educationsStage === index + 1" @click="educationsStage = index + 1" color="#EF8A3E"
                         text>
                    {{ item.specialization }}
                  </v-btn>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row cols="12" sm="6" md="4">
                      <v-col cols="12" sm="12" :md="formTitle === 'Изменить' ? '12' : '12'">
                        <template v-if="changeStage === 1">
                          <v-text-field
                              v-model="editedItem.name"
                              label="Имя"
                          ></v-text-field>
                          <v-text-field
                              v-model="editedItem.last_name"
                              label="Фамилия"
                          ></v-text-field>
                          <v-text-field
                              v-model="editedItem.email"
                              label="Почта"
                          ></v-text-field>
                          <v-text-field
                              v-model="newConvertedDateBirth"
                              v-mask="'##.##.####'"
                              label="Дата рождения"
                          ></v-text-field>
                          <v-text-field
                              v-model="editedItem.about_me"
                              label="О себе"
                          ></v-text-field>
                          <v-switch
                              v-model="editedItem.moderation"
                              color="orange"
                              :label="editedItem.moderation ? 'Подтверждён' : 'Не подтверждён'"
                              hide-details
                          ></v-switch>
                        </template>
                        <template v-if="changeStage === 2">
                          <v-select
                              v-model="currentSpecialisationsTitle"
                              :items="allSpecialisationsTitle"
                              :menu-props="{ maxHeight: '400' }"
                              label="Специализация"
                              multiple
                              persistent-hint
                          ></v-select>
                        </template>
                        <template v-if="editedItem.Courses && changeStage === 3">
                          <v-text-field
                              v-model="editedItem.Courses[coursesStage - 1].name"
                              label="Название курса"
                          ></v-text-field>
                          <v-text-field
                              v-model="editedItem.Courses[coursesStage - 1].description"
                              label="Описание курса"
                          ></v-text-field>
                          <v-text-field
                              v-model="convertedCourseStart[coursesStage - 1]"
                              v-mask="'##.##.####'"
                              label="Начало курса"
                          ></v-text-field>
                          <v-text-field
                              v-if="!editedItem.Courses[coursesStage - 1].till_now"
                              v-model="convertedCourseEnd[coursesStage - 1]"
                              v-mask="'##.##.####'"
                              label="Конец курса"
                          ></v-text-field>
                          <v-checkbox
                              :disabled="editedItem.Courses[coursesStage - 1].till_now"
                              v-model="editedItem.Courses[coursesStage - 1].till_now"
                              color="orange"
                              :label="'До текущего момента'"
                              hide-details
                          ></v-checkbox>
                        </template>
                        <template v-if="editedItem.Diploms && changeStage === 4">
                          <v-text-field
                              v-model="editedItem.Diploms[diplomsStage - 1].title"
                              label="Название Диплома"
                          ></v-text-field>
                          <v-img v-if="editedItem.Diploms[diplomsStage - 1].Files[0]"
                                 :src="editedItem.Diploms[diplomsStage - 1].Files[0].url"/>
                        </template>
                        <template v-if="editedItem.Educations && changeStage === 5">
                          <v-text-field
                              v-model="editedItem.Educations[educationsStage - 1].specialization"
                              label="Название образования"
                          ></v-text-field>
                          <v-text-field
                              v-model="editedItem.Educations[educationsStage - 1].faculty"
                              label="Название факультета"
                          ></v-text-field>
                          <v-text-field
                              v-model="editedItem.Educations[educationsStage - 1].school_name"
                              label="Название учреждения"
                          ></v-text-field>
                          <v-text-field
                              v-model="editedItem.Educations[educationsStage - 1].end_year"
                              label="Год окончания"
                          ></v-text-field>
                        </template>
                        <!-- <div class="">
                          <v-file-input
                            v-model="imageChapter"
                            label="Логотип"
                            show-size
                            accept="image/*"
                            prepend-icon="mdi-camera"
                          />
                          <v-img v-if="urlImage" :src="urlImage" />
                        </div> -->
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-btn v-if="changeStage === 3 || changeStage === 4 || changeStage === 5" color="#E53935" text
                         @click="deleteMasterInfo">
                    Удалить
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="darken darken-1" text @click="close">
                    Закрыть
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
                  Вы хотите удалить мастера?
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
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon color="red" small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:[`item.moderation`]="{ item }">
          <span class="emailValidate" :class="item.moderation ? 'active' : 'no-active'">
            <v-icon color="white" v-if="true">
              mdi-account
            </v-icon>
            <v-icon color="white" v-else>
              mdi-account-alert
            </v-icon>
          </span>
        </template>
        <template v-slot:[`item.Specialisations`]="{ item }">
          <div v-for="(item, index) in item.Specialisations" :key="item.id">
            <br v-if="index !== 0">
            {{ item.title }}
          </div>
          {{ false ? item.Specialisations[0] : '' }}
        </template>
        <template v-slot:[`item.Courses`]="{ item }">
          <div v-for="(item, index) in item.Courses" :key="item.id">
            <br v-if="index !== 0">
            <div>
              {{ item.name }}
            </div>
            <div>
              {{ item.description }}
            </div>
            <div>
              С {{ formatDate(item.start_date) }}
            </div>
            <div>
              По {{ item.till_now ? 'текущий момент' : formatDate(item.end_date) }}
            </div>
          </div>
          {{ false ? item.Courses[0] : '' }}
        </template>
        <template v-slot:[`item.Diploms`]="{ item }">
          <div v-for="(item, index) in item.Diploms" :key="item.id">
            <br v-if="index !== 0">
            <div>
              {{ item.title }}
            </div>
            <!-- <template v-if="item.Files">
              <div v-for="(item) in item.Files" :key="item.id">
                <v-img
                  :lazy-src="item.url"
                  max-height="87"
                  max-width="104"
                  :src="item.url"
                ></v-img>
              </div>
            </template> -->
          </div>
          {{ false ? item.Diploms[0] : '' }}
        </template>
        <template v-slot:[`item.Educations`]="{ item }">
          <div v-for="(item, index) in item.Educations" :key="item.id">
            <br v-if="index !== 0">
            <div>
              {{ item.school_name }}
            </div>
            <div>
              {{ item.faculty }}
            </div>
            <div>
              {{ item.specialization }}
            </div>
            <div>
              Окончен в {{ item.end_year }}
            </div>
          </div>
          {{ false ? item.Educations[0] : '' }}
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ item.createdAt ? formatDate(item.createdAt) : '' }}
        </template>
        <template v-slot:[`item.birth_day`]="{ item }">
          {{ item.birth_day ? formatDate(item.birth_day) : '' }}
        </template>
        <template v-slot:[`item.updatedAt`]="{ item }">
          {{ item.updatedAt ? formatDate(item.updatedAt) : '' }}
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

  &.no-active {
    background-color: rgb(152, 154, 152);
  }

  &.active {
    background-color: green;
  }
}

// .theme--light.v-input--is-disabled {
//   color: rgb(239, 138, 62) !important
// }
// .theme--light.v-label--is-disabled {
//   color: rgba(0, 0, 0, 0.6) !important
// }
</style>
