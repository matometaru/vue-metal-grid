/**
 * Created by mendieta on 4/28/17.
 */
import TransitionGroupPlus from "./components/TransitionGroupPlus";
import TransitionPlus from "./components/TransitionPlus";

const VueTransitionGroupPlus = {};

VueTransitionGroupPlus.install = function (Vue) {

    Vue.component("transition-group-plus", TransitionGroupPlus);
    Vue.component("transition-plus", TransitionPlus);

    /**
     *
     * @type {object}
     * @property chiefs
     */
    Vue.chiefs = {};

    /**
     *
     * @param {string} namespace
     * @param {string} mode
     */
    Vue.addChief = function (namespace, mode) {
        if (!Vue.chiefs[namespace]) {
            Vue.chiefs[namespace] = {
                bus: new Vue(),
                mode: mode,
                pending: false
            };
        } else {
            if (process.env.NODE_ENV !== "production") console.warn(`TransitionGroupPlus: namespace ${namespace} is already in use!`);
        }
        return Vue.chiefs[namespace];
    };

    /**
     *
     * @param {string} namespace
     */
    Vue.removeChief = function (namespace) {
        if (Vue.chiefs[namespace]) {
            Vue.chiefs[namespace] = null;
        } else {
            if (process.env.NODE_ENV !== "production") console.warn(`TransitionGroupPlus: namespace ${namespace} has not been added!`);
        }
    };

};

export default VueTransitionGroupPlus;