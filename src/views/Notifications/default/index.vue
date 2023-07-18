<template>
  <LayoutDefault>
    <div class="">
      <v-card-title> Уведомления</v-card-title>
      <v-data-table
          multi-sort
          :loading="loading"
          :items="dataset"
          :headers="headers"
          item-key="id"
          :items-per-page="15"
          :footerProps="{
          itemsPerPageText: 'Кол-во на странице',
        }"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="400px">
              <template v-slot:activator="{ attrs }">
                <v-btn
                    color="#EF8A3E"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    @click="newItem"
                >
                  Добавить
                </v-btn>
              </template>
              <v-card v-if="isAdding">
                <v-card-title>
                  <span class="text-h5">Добавить уведомление</span>
                </v-card-title>

                <v-card-text>
                  <v-row cols="12" sm="6" md="4">
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                          v-model="newItemData.name"
                          label="Название уведомления"
                      ></v-text-field>
                      <v-textarea
                          label="Текст уведомления (80 символов)"
                          auto-grow
                          rows="6"
                          v-model="newItemData.text"
                          outlined
                      ></v-textarea>
                      <v-select
                          :items="['мастера', 'клиенты', 'все']"
                          v-model="selectValue"
                          label="Типы пользователей"
                      ></v-select>
                      <p class="text-body-1 mt-2">Отправить:</p>
                      <v-radio-group
                          v-if="isAdding"
                          v-model="isAddingWithTimeout"
                          row
                      >
                        <v-radio label="мгновенно" :value="false"></v-radio>
                        <v-radio label="отложенно" :value="true"></v-radio>
                      </v-radio-group>
                      <div v-if="isAddingWithTimeout">
                        <p class="text-body-1 mt-2">
                          Укажите через какой промежуток будет отправлено
                          уведомление (не более 24 часов)
                        </p>
                        <v-row>
                          <v-col cols="4" sm="4" md="4"
                          >
                            <v-text-field
                                label="Часы"
                                v-model="hours"
                                type="number"
                                min="0"
                                max="23"
                            ></v-text-field
                            >
                          </v-col>
                          <v-col cols="4" sm="4" md="4"
                          >
                            <v-text-field
                                label="Минуты"
                                v-model="minutes"
                                type="number"
                                min="0"
                                max="59"
                            ></v-text-field
                            >
                          </v-col>
                        </v-row>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="darken darken-1" text @click="close">
                    Отменить
                  </v-btn>
                  <v-btn
                      color="#EF8A3E"
                      :loading="loadingBtn"
                      text
                      @click="save"
                  >
                    Добавить
                  </v-btn>
                </v-card-actions>
              </v-card>

              <v-card v-if="isEditing">
                <v-card-title>
                  <span class="text-h5">Изменить уведомление</span>
                </v-card-title>

                <v-card-text>
                  <p class="text-h6">{{ currentValue }}</p>

                  <v-btn
                      v-for="item in currentSubstrings"
                      :key="item"
                      color="#EF8A3E"
                      dark
                      class="mb-6 mr-2"
                      :style="{ 'font-size': '12px' }"
                      @click="insertAtCursor(`{${item}}`)"
                  >
                    {{ item }}
                  </v-btn>
                  <v-textarea
                      label="Текст уведомления"
                      auto-grow
                      rows="6"
                      v-model="editedItem.text"
                      outlined
                      ref="textareaRef"
                  ></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="darken darken-1" text @click="close">
                    Отменить
                  </v-btn>
                  <v-btn
                      color="#EF8A3E"
                      :loading="loadingBtn"
                      text
                      @click="save"
                  >
                    Изменить
                  </v-btn>
                </v-card-actions>
              </v-card>

              <v-card v-if="isDeleting">
                <v-card-title>
                  <span class="text-h5">Потверждаете удаление?</span>
                </v-card-title>

                <v-card-text>
                  <p class="text-h6">{{ currentValue }}</p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="darken darken-1" text @click="close">
                    Отменить
                  </v-btn>
                  <v-btn
                      color="#EF8A3E"
                      :loading="loadingBtn"
                      text
                      @click="save"
                  >
                    Подтвердить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon v-if="item.type === 1" small @click="editItem(item)"
          >mdi-pencil
          </v-icon
          >
          <v-icon
              v-if="item.type === 2"
              color="red"
              small
              @click="deleteItem(item)"
          >mdi-delete
          </v-icon
          >
        </template>
      </v-data-table>
    </div>
  </LayoutDefault>
</template>
<script src="./script.js"></script>
