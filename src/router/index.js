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
import Booking from "../views/Booking/default";
import Specializations from "../views/Specializations/default"
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
    path: "/specializations",
    name: "Specializations",
    component: Specializations,
  },
  {
    path: "/feeds",
    name: "Feeds",
    component: Feeds,
  },
  {
    path: "/clients",
    name: "Clients",
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
    path: "/booking",
    name: "Booking",
    component: Booking,
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
  base: '/admin',
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
