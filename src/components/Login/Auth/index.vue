<template>
  <v-card class="elevation-2 w-50">
    <v-toolbar dark color="blue">
      <v-toolbar-title>Авторизация</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          prepend-icon="mdi-account"
          name="login"
          label="Имя пользователя"
          type="text"
          v-model="username"
        />
        <v-text-field
          id="password"
          prepend-icon="mdi-lock"
          name="password"
          label="Пароль"
          type="password"
          v-model="password"
        />
        <div class="error" v-if="message">{{ message }}</div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue" @click="handleLogin">Войти</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script src="./script.js"></script>
<style src="./style.scss" scoped module lang="scss"></style>
