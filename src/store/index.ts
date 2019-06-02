import Vue from 'vue';
import Vuex from 'vuex';


import { HTTP } from "../api/index";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        allList: [],
        filterList: [],
        title: null,
        isLoading: false,
        count: null

    },
    getters: {},
    mutations: {
        SET_LIST: (state, payload) => {
            state.filterList = payload;
        },
        SET_ALL_LIST: (state, payload) => {
            state.allList = state.allList.concat(payload.results);
            state.filterList = state.allList;
            state.count = payload.count;
        },

        SET_SEARCH_REQ: (state, payload) => {
            state.allList = payload.results;
            state.filterList = state.allList;
            state.count = payload.count;
        },

        RES__ALL: (state) => {
            state.allList = [];
        },

        SET_TITLE: (state, payload) => {
            if (state.title != payload) {
                state.title = payload;
            }

        },

    },
    actions: {
        GET_ALL_LIST: (context, obj) => {
            if (obj.currentType != context.state.title) {
                context.state.isLoading = true;
                context.commit('RES__ALL');

                HTTP.get(obj.currentType + "/?search=" + obj.text).then(response => {
                    context.commit('SET_ALL_LIST', response.data);

                    if (response.data.next != null) {
                        context.dispatch("checkNext", response.data.next)

                    } else {
                        context.state.isLoading = false;
                    }

                });
            }
        },

        GET_REQ_LIST: (context, obj) => {
            context.state.isLoading = true;
            HTTP.get(
                obj.currentType + "/?search=" + obj.text
            ).then(response => {
                context.commit('SET_SEARCH_REQ', response.data);

                if (response.data.next != null) {
                    context.dispatch("checkNext", response.data.next)

                } else {
                    context.state.isLoading = false;
                }



            });
        },

        checkNext: (context, next) => {
            HTTP.get(next).then(response => {
                context.commit('SET_ALL_LIST', response.data);

                if (response.data.next != null) {
                    context.dispatch("checkNext", response.data.next)
                } else {
                    context.state.isLoading = false;
                }

            });

        },
    },
});