export default {
  name: "Nav",

  data() {
    return {
      items: [
        { title: 
          "Главная", 
          icon: "mdi-home", 
          route: "/", 
          group: true 
        },
        { 
          title: "Города", 
          icon: "mdi-city", 
          route: "/cities", 
          group: true 
        },
        {
          title: "Услуги",
          icon: "mdi-face-agent",
          route: "/services",
          group: true,
        },
        {
          title: "Клиенты",
          icon: "mdi-cog",
          route: "/classes",
          group: true,
        },
        {
          title: "Мастера",
          icon: "mdi-cog",
          route: "/categories",
          group: true,
        },
        {
          title: "Расписание",
          icon: "mdi-timetable",
          route: "/categories",
          group: true,
        },
        { 
          title: 
          "Жалобы", 
          icon: "mdi-message-alert", 
          route: "/categories", 
          group: true 
        },
          { 
          title: 
          "Счета", 
          icon: "mdi-receipt", 
          route: "/categories", 
          group: true 
        },
          { 
          title: 
          "Уведомления", 
          icon: "mdi-bell", 
          route: "/categories", 
          group: true 
        }
      ],
    }
  },
  computed: {
    username() {
      return this.$store.state.auth.user;
    },
  },

  methods: {
    logout() {
      this.$store.dispatch("auth/logout")
      this.$router.push("/login")
    },
  },
}