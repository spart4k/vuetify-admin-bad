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
          icon: "mdi-account-group",
          route: "/clients",
          group: true,
        },
        {
          title: "Мастера",
          icon: "mdi-account-tie",
          route: "/masters",
          group: true,
        },
        {
          title: "Бронирование",
          icon: "mdi-book-open-variant",
          route: "/booking",
          group: true,
        },
        {
          title: "Расписание",
          icon: "mdi-timetable",
          route: "/shedules",
          group: true,
        },
        { 
          title: 
          "Отзывы", 
          icon: "mdi-message-alert", 
          route: "/feeds", 
          group: true 
        },
          { 
          title: 
          "Счета", 
          icon: "mdi-receipt", 
          route: "/invoices", 
          group: true 
        },
          { 
          title: 
          "Уведомления", 
          icon: "mdi-bell", 
          route: "/notifications", 
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