import VueRouter from "vue-router";
import auth from "../store/auth";
import Home from "../views/Home/default";
import Login from "../views/Login/default";
import Cities from "../views/Cities/default";
import Feeds from "../views/Feeds/default";
import Invoices from "../views/Invoices/default";
import Masters from "../views/Masters/default";
import Notifications from "../views/Notifications/default";
import Clients from "../views/Clients/default";
import Shedules from "../views/Shedules/default";
import Services from "../views/Services/default";
import Appointment from "../views/Appointment/default";
// import Categories from "../views/Categories/default";

// import Classes from "../views/Class.vue";
// import Chapters from "../views/ViewChapters.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/cities",
    name: "Cities",
    component: Cities,
  },
  {
    path: "/feeds",
    name: "Feeds",
    component: Feeds,
  },
  {
    path: "/clients",
    name: "Feeds",
    component: Clients,
  },
  {
    path: "/invoices",
    name: "Invoices",
    component: Invoices,
  },
  {
    path: "/masters",
    name: "Masters",
    component: Masters,
  },
  {
    path: "/appointment",
    name: "Appointment",
    component: Appointment,
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
  },
  {
    path: "/services",
    name: "Services",
    label: 'Услуги',
    component: Services,
  },
  {
    path: "/shedules",
    name: "Shedules",
    component: Shedules,
  },
  // {
  //   path: "/categories",
  //   name: "Categories",
  //   component: Categories,
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  /*
  const publicPages = ["/login"]
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath
    return "/login"
  }
  */

  if (!auth.state.user && to.path !== "/login") {
    next("/login");
  } else {
    next();
  }
});
export default router;
