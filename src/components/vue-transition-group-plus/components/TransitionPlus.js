/**
 * Created by mendieta on 4/28/17.
 */

import Vue from "vue";

export default Vue.component("TransitionPlus", {
    functional: true,
    props: {
        appear: {
            type: Boolean,
            default: false
        },
        css: {
            type: Boolean,
            default: false
        }
    },
    inject: ["namespace"],
    render(h, ctx){
        const chief = Vue.chiefs[ctx.injections.namespace];
        const {bus, mode} = chief;
        const events = ctx.data.on;
        const callbacks = {};
        const beforeEnterCallback = ctx.data.attrs.beforeEnter; // 追加
        const enterCallback = events.enter;
        const leaveCallback = events.leave;
        delete events.enter;
        delete events.leave;

        return h('transition', {
            props: {
                css: ctx.props.css,
                appear: ctx.props.appear,
            },
            on: {
                // 追加
                beforeEnter(el) {
                    beforeEnterCallback(el);
                },
                enter(el, done){
                    if (mode === "out-in") {
                        callbacks.pendingEnter = () => {
                            enterCallback ? enterCallback(el, done) : done();
                        };
                        if (chief.pending) {
                            bus.$once("next", callbacks.pendingEnter);
                        } else {
                            callbacks.pendingEnter();
                        }
                    } else if (mode === "in-out") {
                        callbacks.pendingEnter = () => {
                            done();
                            chief.pending = false;
                            bus.$emit("next");
                        };
                        if (enterCallback) {
                            enterCallback(el, callbacks.pendingEnter);
                        } else {
                            console.log("enter in-out");
                            callbacks.pendingEnter();
                        }
                    } else {
                        enterCallback ? enterCallback(el, done) : done();
                    }
                },
                enterCancelled(){
                    if (mode !== "simultaneous") bus.$off("next", callbacks.pendingEnter);
                },
                leave(el, done){
                    if (mode !== "simultaneous") chief.pending = true;
                    if (mode === "out-in") {
                        callbacks.pendingLeave = () => {
                            done();
                            chief.pending = false;
                            bus.$emit("next");
                        };
                        if (leaveCallback) {
                            leaveCallback(el, callbacks.pendingLeave);
                        } else {
                            callbacks.pendingLeave();
                        }
                    } else if (mode === "in-out") {
                        callbacks.pendingLeave = () => {
                            leaveCallback ? leaveCallback(el, done) : done();
                        };
                        if (chief.pending) {
                            bus.$once("next", callbacks.pendingLeave);
                        } else {
                            callbacks.pendingLeave();
                        }
                    } else {
                        leaveCallback ? leaveCallback(el, done) : done();
                    }
                },
                leaveCancelled(){
                    if (mode !== "simultaneous") bus.$off("next", callbacks.pendingLeave);
                },
                ...events,
            }
        }, ctx.children);
    }
});
