<template>
  <v-card class="elevation-2 w-50">
    <v-toolbar dark color="#EF8A3E">
      <v-toolbar-title>Авторизация</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          color="#EF8A3E"
          prepend-icon="mdi-account"
          name="login"
          label="Имя пользователя"
          type="text"
          v-model="username"
        >
        <v-icon slot="prependIcon" large color="#EF8A3E">mdi-account</v-icon>
        </v-text-field>
        <v-text-field
          color="#EF8A3E"
          id="password"
          prepend-icon="mdi-lock"
          name="password"
          label="Пароль"
          type="password"
          v-model="password"
        >
        <v-icon slot="prependIcon" large color="#EF8A3E">mdi-lock</v-icon>
        </v-text-field>
        <div class="error" v-if="message">{{ message }}</div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="#EF8A3E" @click="handleLogin">Войти</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script src="./script.js"></script>
<style src="./style.scss" scoped lang="scss"></style>
