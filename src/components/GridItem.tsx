import Vue, { PropType } from 'vue';
import { transition, buildStyles, Units } from '../utils/style-helper';

import { RecordPropsDefinition } from 'vue/types/options';

// https://gist.github.com/wonderful-panda/3156681f25ee72e1a3bfbeaf3764288b propsの型を抽出するやつ
export type RequiredPropNames<PD extends RecordPropsDefinition<any>> = ({
  [K in keyof PD]: PD[K] extends { required: true } ? K : never
})[keyof PD];

export type OptionalPropNames<PD extends RecordPropsDefinition<any>> = {
  [K in keyof PD]: PD[K] extends { required: true } ? never : K
}[keyof PD];

export type OuterProps<
  PropDefs extends RecordPropsDefinition<any>
> = PropDefs extends RecordPropsDefinition<infer P>
  ? { [K in RequiredPropNames<PropDefs> & keyof P]: P[K] } &
      { [K in OptionalPropNames<PropDefs> & keyof P]?: P[K] }
  : never;

type Props = OuterProps<typeof Props>;

const Props = {
  index: {
    type: Number,
    required: true as true,
  },
  itemKey: [Number, String],
  component: {
    type: String,
    default: 'span',
  },
  rect: {
    type: Object as PropType<Rect>,
    required: true as true,
  },
  containerSize: Object as PropType<any>,
  duration: Number,
  easing: String,
  appearDelay: Number,
  appear: {
    type: Function,
    required: true as true,
  },
  appeared: {
    type: Function,
    required: true as true,
  },
  enter: {
    type: Function,
    required: true as true,
  },
  entered: {
    type: Function,
    required: true as true,
  },
  leaved: {
    type: Function,
    required: true as true,
  },
  units: {
    type: Object as PropType<Units>,
    required: true as true,
  },
  vendorPrefix: {
    type: Boolean,
    required: true as true,
  },
  mountedCb: Function,
  unmountCb: Function,
  rtl: Boolean,
};

const getTransitionStyles = (type: TransitionType, props: Props) => {
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
        ...getTransitionStyles('appear', this.$props as Props),
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
    this.mountedCb(this);
  },

  destroyed() {
    this.unmountCb(this);
  },

  methods: {
    setStateIfNeeded(state: any) {
      this.state = state;
    },

    setAppearedStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getTransitionStyles('appeared', this.$props as Props),
        ...getPositionStyles(this.rect, 1, this.rtl),
      });
    },

    setEnterStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getPositionStyles(this.rect, 2, this.rtl),
        ...getTransitionStyles('enter', this.$props as Props),
      });
    },

    setEnteredStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getTransitionStyles('entered', this.$props as Props),
        ...getPositionStyles(this.rect, 1, this.rtl),
      });
    },

    setLeaveStyles() {
      this.setStateIfNeeded({
        ...this.state,
        ...getPositionStyles(this.rect, 2, this.rtl),
        ...getTransitionStyles('leaved', this.$props as Props),
      });
    },

    /**
     * スタイルを返す
     *
     * @return {Object} { zIndex: 1, opacity: 1, transform: "translateX(15px) translateY(0px)", … }
     */
    getStyles(): Record<string, string> {
      const styles = buildStyles(
        {
          ...this.state,
          display: 'block',
          position: 'absolute',
          top: 0,
          ...(this.rtl ? { right: 0 } : { left: 0 }),
          width: `${this.rect.width}px`,
          transition: transition(
            ['opacity', 'transform'],
            this.duration,
            this.easing
          ),
        },
        this.units,
        this.vendorPrefix
      );

      return styles;
    },

    setStyles(el: HTMLElement, styles: Record<string, string>) {
      for (const key in styles) {
        el.setAttribute(key, styles[key]);
      }
    },

    onBeforeEnter() {
      this.setEnterStyles();
    },

    onEnter() {
      this.setEnteredStyles();
    },

    onLeave(el: HTMLElement, done: any) {
      this.setLeaveStyles();
      const styles = this.getStyles();
      this.setStyles(el, styles);
      setTimeout(done, this.duration);
    },
  },

  render(h) {
    const Element = this.component;
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
