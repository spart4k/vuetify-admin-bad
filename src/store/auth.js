const userStr = localStorage.getItem("user");

const initialState = userStr ? JSON.parse(userStr) : { user: null };

const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login(context, data) {
      if (data.username === "admin" && data.password === "admin") {
        context.commit("loginSuccess", data.username);
        return true;
      }

      context.commit("loginFailure");
      return false;
    },
    logout(context) {
      context.commit("logout");
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(state));
    },
    loginFailure(state) {
      state.user = null;
    },
    logout(state) {
      localStorage.removeItem("user");
      state.user = null;
    },
  },
};

export default auth;
