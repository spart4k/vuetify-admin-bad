export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      message: '',
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    handleLogin() {
      const loginPromise = this.$store.dispatch('auth/login', { username: this.username, password: this.password })

      loginPromise.then((login) => {
        if (login) {
          this.message = ''
          this.$router.push('/cities')
        } else {
          this.message = 'Имя или пароль не верны'
        }
      })
    },
  },
}