/**
 * Created by mendieta on 4/28/17.
 */
import Vue from "vue";

export default{
    name: 'TransitionGroupPlus',
    props: {
        tag: {
            type: String,
            default: "span"
        },
        transitionMode: {
            type: String,
            default: "out-in",
            validator: function (value) {
                return value === "out-in" || value === "in-out" || value === "simultaneous";
            }
        }
    },
    provide: {
        namespace: (Math.floor( Math.random() * (100 + 1 - 5) ) + 5).toString()
    },
    created(){
        this.data = Vue.addChief(this._provided.namespace, this.transitionMode);
    },
    beforeDestroy(){
        // Vue.removeChief(this._provided.namespace);
    },
    watch: {
        transitionMode(value){
            this.data.mode = value;
            if (process.env.NODE_ENV !== "production" && value === "simultaneous") {
                console.warn(`TransitionGroupPlus: if using simultaneous transitions there is no need to use Transition Group Plus!`);
            }
        }
    },
    render(h){
        return h(this.tag, this.$slots.default);
    }
};
