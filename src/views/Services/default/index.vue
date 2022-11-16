<template>
  <LayoutDefault>
    <div class="">
      <v-card-title>
        Услуги
      </v-card-title>
      
      <div v-for="(service, index) in dataset" :key="service.id" class="">
        <table class="service-group-header">
          <tbody>
            <tr>
              <td width="5">{{ service.id }}</td>
              <td width="10%">{{ service.title }}</td>
              <td width="75.5%">
                <v-img
                  class="service-logotype"
                  :src="'https://tints.c.roky.rocks/'+service.img"
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
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </td>
              <td width="">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon color="red" small @click="deleteItem(item)">mdi-delete</v-icon>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- <v-row class="fluid d-flex justify-content-spacebetween service-header">
          <div class="">
            {{ service.id }}
          </div>
          <div class="">
            {{ service.title }}
          </div>
          
        </v-row> -->
        
        <v-data-table
          v-if="service.chapter_classes.length > 0"
          multi-sort
          :loading="loading"
          :search="search"
          :items="service.chapter_classes"
          :expand="expand"
          :headers="headers"
          :expanded.sync="expands"
          item-key="id"
          group-by="title"
          :footerProps="{
            itemsPerPageText: 'Кол-во на странице'
          }"
        > 
          <template v-slot:[`group.header`]="{ group, toggle, isOpen }">
            <td width="10" colspan="1">
              id
            </td>
            <td width="85%" colspan="1" class="">
                {{ group }}
            </td>
            <td colspan="1">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon color="red" small @click="deleteItem(item)">mdi-delete</v-icon>
              <v-btn @click="toggle" small icon :ref="group" :data-open="isOpen">
                <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
                <v-icon v-else>mdi-chevron-down</v-icon>
              </v-btn>
            </td>
          </template> 
          <template v-slot:item>
            <tr v-for="(categorie) in dataset[index].chapter_categories" :key="categorie.id">
              <td width="10" colspan="1">
                {{ categorie.id }}
              </td>
              <td width="85%" colspan="1">
                {{ categorie.title }}
              </td>
              <td colspan="1">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon color="red" small @click="deleteItem(item)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
  </LayoutDefault>
</template>
<script src="./script.js"></script>
<style lang="scss" scoped>
  .service {
    &-group {
      &-header {
        width: 100%;
        border-bottom: 1px solid #000;
        td {
          padding: 1rem;
        }
      }
    }
    &-logotype {
      width: 3rem;
    }
  }
</style>
