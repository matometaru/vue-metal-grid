import Vue from 'vue';
// @ts-ignore
import { transition, buildStyles } from '../utils/style-helper';

const Props = {
  index: Number,
  itemKey: [Number, String],
  component: {
    type: String,
    default: 'span',
  },
  rect: Object,
  containerSize: Object,
  duration: Number,
  easing: String,
  appearDelay: Number,
  appear: Function,
  appeared: Function,
  enter: Function,
  entered: Function,
  leaved: Function,
  units: Object,
  vendorPrefix: Boolean,
  userAgent: String,
  mountedCb: Function,
  unmountCb: Function,
  rtl: Boolean,
};

const getTransitionStyles = (type: any, props: any) => {
  const { rect, containerSize, index } = props;

  return props[type](rect, containerSize, index);
};

const getPositionStyles = (rect: any, zIndex: any, rtl: any) => ({
  translateX: `${rtl ? -Math.round(rect.left) : Math.round(rect.left)}px`,
  translateY: `${Math.round(rect.top)}px`,
  zIndex,
});

export default Vue.extend({
  name: 'GridItem',

  props: Props,

  data() {
    return {
      appearTimer: null,
      node: null,
      state: {
        ...getPositionStyles(this.$props.rect, 1, this.$props.rtl),
        ...getTransitionStyles('appear', this.$props),
      },
    };
  },

  watch: {
    rect() {
      this.setStateIfNeeded({
        ...this.state,
        ...getPositionStyles(this.$props.rect, 2, this.$props.rtl),
      });
    },
  },

  mounted() {
    setTimeout(
      this.setAppearedStyles,
      this.$props.appearDelay * this.$props.index
    );
    this.$props.mountedCb(this);
  },

  destroyed() {
    this.$props.unmountCb(this);
  },

  methods: {
    setStateIfNeeded(state: any) {
      this.state = state;
    },

    setAppearedStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getTransitionStyles('appeared', this.$props),
        ...getPositionStyles(this.$props.rect, 1, this.$props.rtl),
      });
    },

    setEnterStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getPositionStyles(this.$props.rect, 2, this.$props.rtl),
        ...getTransitionStyles('enter', this.$props),
      });
    },

    setEnteredStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getTransitionStyles('entered', this.$props),
        ...getPositionStyles(this.$props.rect, 1, this.$props.rtl),
      });
    },

    setLeaveStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getPositionStyles(this.$props.rect, 2, this.$props.rtl),
        ...getTransitionStyles('leaved', this.$props),
      });
    },

    /**
     * スタイルを返す
     *
     * @return {Object} { zIndex: 1, opacity: 1, transform: "translateX(15px) translateY(0px)", … }
     */
    getStyles() {
      const {
        rect,
        duration,
        easing,
        units,
        vendorPrefix,
        userAgent,
        rtl,
      } = this.$props;

      const styles = buildStyles(
        {
          ...this.state,
          display: 'block',
          position: 'absolute',
          top: 0,
          ...(rtl ? { right: 0 } : { left: 0 }),
          width: `${rect.width}px`,
          transition: transition(['opacity', 'transform'], duration, easing),
        },
        units,
        vendorPrefix,
        userAgent
      );

      return styles;
    },

    /* eslint-disable no-param-reassign */
    setStyles(el: any, styles: any) {
      for (const key in styles) {
        el.style[key] = styles[key];
      }
    },
    /* eslint-enable no-param-reassign */

    /* eslint-disable no-unused-vars */
    onBeforeEnter(el: any) {
      this.setEnterStyles();
    },

    onEnter(el: any, done: any) {
      this.setEnteredStyles();
    },

    onLeave(el: any, done: any) {
      this.setLeaveStyles();
      // stylesのオブジェクトを取得
      const styles = this.getStyles();
      // elにスタイル設定。
      this.setStyles(el, styles);
      setTimeout(done, this.$props.duration);
    },
    /* eslint-enable no-unused-vars */
  },

  render(h) {
    const { component: Element } = this.$props;

    const style = this.getStyles();

    return (
      // @ts-ignore
      <transition-plus
        beforeEnter={this.onBeforeEnter}
        onEnter={this.onEnter}
        onLeave={this.onLeave}
      >
        <Element style={style}>{this.$slots.default}</Element>
        {/* 
        // @ts-ignore */}
      </transition-plus>
    );
  },
});
