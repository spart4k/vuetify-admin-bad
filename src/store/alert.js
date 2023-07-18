const auth = {
    namespaced: true,
    state: {
        isShow: false,
        type: 'success',
        content: ''
    },
    mutations: {
        show(state, options) {
            console.log('isshow')
            if (state.isShow) {
                state.isShow = false
                setTimeout(() => {
                    state.isShow = true
                }, 100)
            } else {
                state.isShow = true
            }
            state.type = options.type
            state.content = options.content
            if (options.duration) {
                setTimeout(() => {
                    state.isShow = false
                }, options.duration)
            }
        }
    },
};

export default auth;
