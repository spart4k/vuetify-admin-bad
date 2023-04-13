<template>
  <LayoutDefault>
    <div class="services">
      <v-card-title>
        Услуги
      </v-card-title>
      <v-toolbar flat>
        <!-- <v-toolbar-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Поиск"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" :max-width="formTitle === 'Изменить' ? '300px' : '300px'">
          <template v-slot:activator="{ attrs }">
            <v-btn color="#EF8A3E" dark class="mb-2" v-bind="attrs" @click="newItem">
              Добавить
            </v-btn>
          </template>
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
                      label="Название"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.title_over_children"
                      label="Действие при выборе"
                    ></v-text-field>
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
              Вы хотите удалить сервис?
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
        <v-dialog v-model="dialogDeleteClass" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              Вы хотите удалить класс {{editedItemClass.name}}?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDeleteClass">
                Отмена
              </v-btn>
              <v-btn color="red darken-1" text @click="deleteItemClassConfirm">
                Удалить
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDeleteCategories" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              Вы хотите удалить категорию {{editedItemCategories.name}}?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDeleteCategories">
                Отмена
              </v-btn>
              <v-btn color="red darken-1" text @click="deleteItemCategoriesConfirm">
                Удалить
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogClass" max-width="300px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitleClass }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row cols="12" sm="6" md="4">
                  <v-col cols="12" sm="12" :md="formTitle === 'Изменить' ? '12' : '12'">
                    <!-- <v-text-field
                      v-model="editedItemClass.title"
                      label="Заголовок класса"
                    ></v-text-field> -->
                    <v-text-field
                      v-model="editedItem.name"
                      label="Название"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.title_over_children"
                      label="Действие при выборе"
                    ></v-text-field>
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
              <v-btn color="darken darken-1" text @click="closeClass">
                Отменить
              </v-btn>
              <v-btn color="#EF8A3E" :loading="loadingBtn" text @click="saveClass">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogCategories" max-width="300px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitleCategories }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row cols="12" sm="6" md="4">
                  <v-col cols="12" sm="12" :md="formTitle === 'Изменить' ? '12' : '12'">
                    <v-text-field
                      v-model="editedItemCategories.title"
                      label="Заголовок категории"
                    ></v-text-field>
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
              <v-btn color="darken darken-1" text @click="closeCategories">
                Отменить
              </v-btn>
              <v-btn color="#EF8A3E" :loading="loadingBtn" text @click="saveCategories">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-expansion-panels>
        <v-expansion-panel
        v-for="(service) in dataset" :key="service.id"
        >
          <v-expansion-panel-header> 
            <table class="service-group-header">
              <tbody>
                <tr>
                  <td width="5%">{{ service.id }}</td>
                  <td width="15%">{{ service.name }}</td>
                  <td width="65.5%">
                    <v-img
                      class="service-logotype"
                      :src="service.img"
                      lazy-src="https://picsum.photos/id/11/100/60"
                      max-width="50"
                      max-height="50"
                      contain
                      >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <!-- <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          ></v-progress-circular> -->
                        </v-row>
                      </template>
                    </v-img>
                  </td>
                  <td width="">
                    <v-icon small class="mr-2" @click.stop="addClass(service)">mdi-plus</v-icon>
                    <v-icon small class="mr-2" @click.stop="editItem(service)">mdi-pencil</v-icon>
                    <v-icon color="red" small @click="deleteItem(service)">mdi-delete</v-icon>
                    <v-btn class="service-group-header-icon" small icon>
                      <v-icon>mdi-chevron-up</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-expansion-panels>
              <v-expansion-panel v-for="(service) in service.Children" :key="service.id">
                <v-expansion-panel-header color="rgb(240 240 240)">
                  <table class="service-group-header">
                    <tbody>
                      <tr>
                        <td width="5%">{{ service.id }}</td>
                        <td width="15%">{{ service.name }}</td>
                        <td width="65.5%">
                          <v-img
                            class="service-logotype"
                            :src="service.img"
                            lazy-src="https://picsum.photos/id/11/100/60"
                            max-width="50"
                            max-height="50"
                            contain
                            >
                            <template v-slot:placeholder>
                              <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                              >
                                <!-- <v-progress-circular
                                  indeterminate
                                  color="grey lighten-5"
                                ></v-progress-circular> -->
                              </v-row>
                            </template>
                          </v-img>
                        </td>
                        <td width="">
                          <v-icon small class="mr-2" @click.stop="addClass(service)">mdi-plus</v-icon>
                          <v-icon small class="mr-2" @click.stop="editItem(service)">mdi-pencil</v-icon>
                          <v-icon color="red" small @click="deleteItem(service)">mdi-delete</v-icon>
                          <v-btn class="service-group-header-icon" small icon>
                            <v-icon>mdi-chevron-up</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-expansion-panels>
                    <v-expansion-panel v-for="(service) in service.Children" :key="service.id">
                      <v-expansion-panel-header color="rgb(225 225 225)">
                        <table class="service-group-header">
                          <tbody>
                            <tr>
                              <td width="5%">{{ service.id }}</td>
                              <td width="15%">{{ service.name }}</td>
                              <td width="65.5%">
                                <v-img
                                  class="service-logotype"
                                  :src="service.img"
                                  lazy-src="https://picsum.photos/id/11/100/60"
                                  max-width="50"
                                  max-height="50"
                                  contain
                                  >
                                  <template v-slot:placeholder>
                                    <v-row
                                      class="fill-height ma-0"
                                      align="center"
                                      justify="center"
                                    >
                                      <!-- <v-progress-circular
                                        indeterminate
                                        color="grey lighten-5"
                                      ></v-progress-circular> -->
                                    </v-row>
                                  </template>
                                </v-img>
                              </td>
                              <td width="">
                                <v-icon small class="mr-2" @click.stop="addClass(service)">mdi-plus</v-icon>
                                <v-icon small class="mr-2" @click.stop="editItem(service)">mdi-pencil</v-icon>
                                <v-icon color="red" small @click="deleteItem(service)">mdi-delete</v-icon>
                                <v-btn class="service-group-header-icon" small icon>
                                  <v-icon>mdi-chevron-up</v-icon>
                                </v-btn>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-expansion-panels readonly>
                          <v-expansion-panel v-for="(service) in service.Children" :key="service.id" color="rgb(20 21 211)">
                            <v-expansion-panel-header color="rgb(210 210 210)">
                              <table class="service-group-header">
                                <tbody>
                                  <tr>
                                    <td width="5%">{{ service.id }}</td>
                                    <td width="15%">{{ service.name }}</td>
                                    <td width="65.5%">
                                      <v-img
                                        class="service-logotype"
                                        :src="service.img"
                                        lazy-src="https://picsum.photos/id/11/100/60"
                                        max-width="50"
                                        max-height="50"
                                        contain
                                        >
                                        <template v-slot:placeholder>
                                          <v-row
                                            class="fill-height ma-0"
                                            align="center"
                                            justify="center"
                                          >
                                            <!-- <v-progress-circular
                                              indeterminate
                                              color="grey lighten-5"
                                            ></v-progress-circular> -->
                                          </v-row>
                                        </template>
                                      </v-img>
                                    </td>
                                    <td width="">
                                      <!-- <v-icon small class="mr-2" @click.stop="addClass(service)">mdi-plus</v-icon> -->
                                      <v-icon small class="mr-2" @click.stop="editItem(service)">mdi-pencil</v-icon>
                                      <v-icon color="red" small @click="deleteItem(service)">mdi-delete</v-icon>
                                      <!-- <v-btn class="service-group-header-icon" small icon>
                                        <v-icon>mdi-chevron-up</v-icon>
                                      </v-btn> -->
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </v-expansion-panel-header>
                          </v-expansion-panel>
                        </v-expansion-panels>

                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <!-- <v-data-table
              v-if="service.Children"
              multi-sort
              :loading="loading"
              :search="search"
              :items="service.Children"
              :expand="expand"
              :headers="headers"
              :expanded.sync="expands"
              item-key="id"
              group-by="search"
              :footerProps="{
                itemsPerPageText: 'Кол-во на странице'
              }"
            > 
              <template v-slot:[`group.header`]="{ items, toggle, isOpen }">
                  <td width="20" colspan="1">
                    {{ items[0].id }}
                  </td>
                  <td width="75.5%" colspan="1" class="">
                      {{ items[0].name }}
                  </td>
                  <td colspan="1">
                    <v-icon small class="mr-2" @click.stop="addCategories(service)">mdi-plus</v-icon>
                    <v-icon small class="mr-2" @click.stop="editClass(items[0], service)">mdi-pencil</v-icon>
                    <v-icon color="red" small @click.stop="deleteItemClass(items[0], service)">mdi-delete</v-icon>
                    <v-btn @click="toggle" small icon class="accordion-btn" :class="isOpen ? 'active': ''" :data-open="isOpen">
                      <v-icon class="accordion-btn-icon">mdi-chevron-up</v-icon>
                    </v-btn>
                  </td>
              </template>
              <template v-slot:item>
                <td width="20" colspan="1">
                    {{ items[0].id }}
                  </td>
                  <td width="75.5%" colspan="1" class="">
                      {{ items[0].name }}
                  </td>
                  <td colspan="1">
                    <v-icon small class="mr-2" @click.stop="addCategories(service)">mdi-plus</v-icon>
                    <v-icon small class="mr-2" @click.stop="editClass(items[0], service)">mdi-pencil</v-icon>
                    <v-icon color="red" small @click.stop="deleteItemClass(items[0], service)">mdi-delete</v-icon>
                    <v-btn @click="toggle" small icon class="accordion-btn" :class="isOpen ? 'active': ''" :data-open="isOpen">
                      <v-icon class="accordion-btn-icon">mdi-chevron-up</v-icon>
                    </v-btn>
                  </td>
              </template>
            </v-data-table> -->
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </LayoutDefault>
</template>
<script src="./script.js"></script>
<style lang="scss" scoped>
  .v-expansion-panel-header--active {
    .service-group-header-icon {
      .v-icon  {
        transform: rotateX(180deg);
      }
    }
  }
  .service {
    &-group {
      &-header {
        width: 100%;
        border-bottom: 1px solid #000;
        
        > div {
          margin-right: 1rem;
        }
        td {
          padding: 1rem;
        }
      }
    }
    &-logotype {
      width: 3rem;
    }
  }
  .v-expansion-panel-header {
    padding: unset;
    &__icon {
      display: none;
    }
  }
  .v-expansion-panel-header__icon {
    display: none in !important;
    position: absolute !important;
    right: 0;
  }
</style>
