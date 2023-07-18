<template>
  <v-navigation-drawer permanent v-if="username" app color="#292929">
    <v-list class="d-flex flex-column justify-space-between" height="100%">
      <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.route"
          style="flex: 0"
          link
      >
        <!--
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        -->

        <v-list-item-content :class="$style.chapter" class="d-flex">
          <v-icon class="mr-5" style="flex: 0">
            {{ item.icon }}
          </v-icon>
          <v-list-item-title style="flex: unset">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item style="flex: 0" class="mt-auto" disable link>
        <v-list-item-content>
          <v-list-item-title
              class="d-flex justify-space-between align-center"
          >
            <span color="white" v-if="username">{{ username }}</span>
            <v-btn variant="text" icon @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style lang="scss" module scoped src="./style.scss"></style>
<script src="./script.js"></script>
