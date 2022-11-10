import VueRouter from "vue-router";
import auth from "../store/auth";
import Home from "../views/Home/index.vue";
import Login from "../views/Login";
import Cities from "../views/Cities";
// import Chapters from "../views/ViewChapters.vue";
import Services from "../views/ViewServices.vue";
import Classes from "../views/ViewClasses.vue";
import Categories from "../views/ViewCategories.vue";

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
    path: "/services",
    name: "Services",
    component: Services,
  },
  {
    path: "/classes",
    name: "Classes",
    component: Classes,
  },
  {
    path: "/categories",
    name: "Categories",
    component: Categories,
  },
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
