import Vue, { PropType } from 'vue';
import { transition, buildStyles, Units } from '../utils/style-helper';

type TransitionType = 'appear' | 'appeared' | 'enter' | 'entered' | 'leaved';

export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const Props = {
  index: Number,
  itemKey: [Number, String],
  component: {
    type: String,
    default: 'span',
  },
  rect: Object as PropType<Rect>,
  containerSize: Object as PropType<any>,
  duration: Number,
  easing: String,
  appearDelay: Number,
  appear: Function,
  appeared: Function,
  enter: Function,
  entered: Function,
  leaved: Function,
  units: Object as PropType<Units>,
  vendorPrefix: Boolean,
  userAgent: String,
  mountedCb: Function,
  unmountCb: Function,
  rtl: Boolean,
};

const getTransitionStyles = (type: TransitionType, props: any) => {
  const { rect, containerSize, index } = props;

  return props[type](rect, containerSize, index);
};

const getPositionStyles = (rect: Rect, zIndex: number, rtl: boolean) => ({
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
        ...getPositionStyles(this.rect, 1, this.rtl),
        ...getTransitionStyles('appear', this),
      },
    };
  },

  watch: {
    rect() {
      this.setStateIfNeeded({
        ...this.state,
        ...getPositionStyles(this.rect, 2, this.rtl),
      });
    },
  },

  mounted() {
    setTimeout(this.setAppearedStyles, this.appearDelay * this.index);
    this.mountedCb(this.$props);
  },

  destroyed() {
    this.unmountCb(this.$props);
  },

  methods: {
    setStateIfNeeded(state: any) {
      this.state = state;
    },

    setAppearedStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getTransitionStyles('appeared', this),
        ...getPositionStyles(this.rect, 1, this.rtl),
      });
    },

    setEnterStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getPositionStyles(this.rect, 2, this.rtl),
        ...getTransitionStyles('enter', this),
      });
    },

    setEnteredStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getTransitionStyles('entered', this),
        ...getPositionStyles(this.rect, 1, this.rtl),
      });
    },

    setLeaveStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getPositionStyles(this.rect, 2, this.rtl),
        ...getTransitionStyles('leaved', this),
      });
    },

    /**
     * スタイルを返す
     *
     * @return {Object} { zIndex: 1, opacity: 1, transform: "translateX(15px) translateY(0px)", … }
     */
    getStyles(): Record<string, string> {
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
    setStyles(el: any, styles: Record<string, string>) {
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
      setTimeout(done, this.duration);
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
