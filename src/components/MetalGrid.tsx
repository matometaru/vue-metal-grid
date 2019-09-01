import Vue, { PropType } from 'vue';
import ExecutionEnvironment from 'exenv';
import elementResizeDetectorMaker from 'element-resize-detector';
import GridItem from './GridItem';
import * as easings from '../animations/easings';
import * as transitions from '../animations/transitions';
import { Units } from '../utils/style-helper';
import VueTransitionGroupPlus from './vue-transition-group-plus/index';

Vue.use(VueTransitionGroupPlus);

const ELEMENT_ID = 'metal-grid';

const imagesLoaded = ExecutionEnvironment.canUseDOM
  ? require('imagesloaded')
  : null;

const isNumber = (v: number) => typeof v === 'number' && isFinite(v);
const isPercentageNumber = (v: string) =>
  typeof v === 'string' && /^\d+(\.\d+)?%$/.test(v);

const Props = {
  className: String,
  css: {
    type: Object as PropType<{ name: string }>,
    default: () => {},
  },
  gridRef: Function,
  component: {
    type: String,
    default: 'div',
  },
  itemComponent: {
    type: String,
    default: 'span',
  },
  columnWidth: {
    type: [Number, String],
    default: 150,
  },
  gutterWidth: {
    type: Number,
    default: 5,
  },
  gutterHeight: {
    type: Number,
    default: 5,
  },
  duration: {
    type: Number,
    default: 480,
  },
  easing: {
    type: String,
    default: easings.quartOut,
  },
  appearDelay: {
    type: Number,
    default: 30,
  },
  appear: {
    type: Function,
    default: transitions.fadeUp.appear,
  },
  appeared: {
    type: Function,
    default: transitions.fadeUp.appeared,
  },
  enter: {
    type: Function,
    default: transitions.fadeUp.enter,
  },
  entered: {
    type: Function,
    default: transitions.fadeUp.entered,
  },
  leaved: {
    type: Function,
    default: transitions.fadeUp.leaved,
  },
  units: {
    type: Object as PropType<Units>,
    default: () =>
      ({
        length: 'em',
        angle: 'deg',
      } as Units),
  },
  monitorImagesLoaded: {
    type: Boolean,
    default: false,
  },
  vendorPrefix: {
    type: Boolean,
    default: true,
  },
  enableSSR: {
    type: Boolean,
    default: false,
  },
  layoutCb: {
    type: Function,
    default: null,
  },
  rtl: {
    type: Boolean,
    default: false,
  },
};

const InlineProps = Object.assign(Props, {
  children: {
    type: Array as PropType<any[]>,
  },
  refCallback: Function,
});

// Vue.$dataの型定義
type Data = {
  items: any[];
  imgLoad: any[];
  size: Size;
  mounted: boolean;
  state: Layout;
  erd: elementResizeDetectorMaker.Erd;
};

/* eslint-disable consistent-return */
const getColumnLengthAndWidth = (
  width: any,
  value: any,
  gutter: any
): number[] => {
  if (isNumber(value)) {
    const columnWidth = parseFloat(value);

    return [
      Math.floor((width - (width / columnWidth - 1) * gutter) / columnWidth),
      columnWidth,
    ];
  }
  if (isPercentageNumber(value)) {
    const columnPercentage = parseFloat(value) / 100;
    const maxColumn = Math.floor(1 / columnPercentage);
    const columnWidth = (width - gutter * (maxColumn - 1)) / maxColumn;

    return [maxColumn, columnWidth];
  }
  return [0, 0];
};
/* eslint-enable consistent-return */

/**
 * GridInline Component
 */
const GridInline = Vue.extend({
  name: 'GridInline',

  props: InlineProps,

  data(): Data {
    return {
      items: [],
      imgLoad: [],
      size: {
        width: 1000,
        height: 1000,
      },
      mounted: false,
      state: {
        rects: [],
        actualWidth: 0,
        height: 0,
        columnWidth: 0,
      },
      erd: {} as elementResizeDetectorMaker.Erd,
    };
  },

  watch: {
    children() {
      this.updateLayout(this.$props);
    },
  },

  created() {
    this.state = this.doLayout(this.$props);
  },

  mounted() {
    this.updateLayout(this.$props);
    this.mounted = true;
    const wrapperElement = document.getElementById(ELEMENT_ID);
    if (wrapperElement === null) {
      throw new Error(`id ${ELEMENT_ID} was not found`);
    }
    this.$nextTick(() => {
      this.erd = elementResizeDetectorMaker({
        strategy: 'scroll',
      });
      this.erd.listenTo(wrapperElement, (element: HTMLElement) => {
        this.size = {
          width: element.offsetWidth,
          height: element.offsetHeight,
        };
        this.updateLayout(this.$props);
      });
    });
  },

  destroyed() {
    const wrapperElement = document.getElementById(ELEMENT_ID);
    if (wrapperElement) {
      this.erd.uninstall(wrapperElement);
    }
  },

  methods: {
    /**
     * itemの高さを返す
     *
     * @param  {Object} this.childrenのitem
     * @return {number} itemの高さ
     */
    getItemHeight(item: any): number {
      // 初期化時点では$refsにまだアクセスできないので、hasOwnPropertyで確認する。
      if (item.key && Object.hasOwnProperty.call(this.items, item.key)) {
        const el = (this.$refs[item.key] as any).$el;
        const candidate = [
          el.scrollHeight,
          el.clientHeight,
          el.offsetHeight,
          0,
        ].filter(isNumber);
        return Math.max(...candidate);
      }

      return 0;
    },

    /**
     * 計算されたstateを返す
     *
     * @param  {Object} PropsInline
     * @return {Object} state
     */
    doLayout(props: any) {
      const results = this.doLayoutForClient(props);

      if (this.mounted && typeof this.$props.layoutCb === 'function') {
        this.$props.layoutCb();
      }

      return results;
    },

    /**
     * this.stateを更新し、レンダリングを行う
     */
    updateLayout(props: any) {
      this.state = this.doLayout(props);
    },

    /**
     * this.$propsから、各itemのスタイルを計算して返す
     *
     * @param PropsInline
     * @return { rects, actualWidth, height, columnWidth }
     */
    doLayoutForClient(props: any): Layout {
      const { columnWidth: rawColumnWidth, gutterWidth, gutterHeight } = props;

      const containerWidth = this.size.width;

      const childArray = Array.isArray(this.children) ? this.children : [];
      const [maxColumn, columnWidth] = getColumnLengthAndWidth(
        containerWidth,
        rawColumnWidth,
        gutterWidth
      );
      // columnHeightsはgridArrayに該当するやつ。
      const columnHeights = Array(maxColumn).fill(0);

      const rects = childArray.map(child => {
        const column = columnHeights.indexOf(Math.min(...columnHeights));
        const height = this.getItemHeight(child);
        const left = column * columnWidth + column * gutterWidth;
        const top = columnHeights[column];

        columnHeights[column] += Math.round(height) + gutterHeight;

        return {
          top,
          left,
          width: columnWidth,
          height,
        };
      });

      const width = maxColumn * columnWidth + (maxColumn - 1) * gutterWidth;
      const height = Math.max(...columnHeights) - gutterHeight;
      const finalRects = rects.map(o => ({
        ...o,
        left: o.left + (containerWidth - width) / 2,
      }));

      return {
        rects: finalRects,
        actualWidth: width,
        height,
        columnWidth,
      };
    },

    handleItemMounted(item: any) {
      const { itemKey: key } = item.$props;
      this.items[key] = item;

      if (
        this.$props.monitorImagesLoaded &&
        typeof imagesLoaded === 'function'
      ) {
        const node = item.$el;
        const imgLoad = imagesLoaded(node);

        imgLoad.once('always', () => {
          this.updateLayout(this.$props);
        });

        this.imgLoad[key] = imgLoad;
      }

      this.updateLayout(this.$props);
    },

    handleItemUnmount(item: any) {
      const { itemKey: key } = item.$props;

      if (Object.hasOwnProperty.call(this.items, key)) {
        delete this.items[key];
      }

      if (Object.hasOwnProperty.call(this.imgLoad, key)) {
        this.imgLoad[key].off('always');
        delete this.imgLoad[key];
      }
    },

    handleRef() {
      this.$props.refCallback(this);
    },
  },

  render(h) {
    const {
      gutterWidth,
      gutterHeight,
      monitorImagesLoaded,
      refCallback,
      className,
      component,
      itemComponent,
      children,
      duration,
      easing,
      units,
      vendorPrefix,
      rtl,
      appearDelay,
      appear,
      appeared,
      enter,
      entered,
      leaved,
      ...rest
    } = this.$props;

    const { rects, actualWidth, height } = this.state;
    const containerSize = {
      actualWidth,
      width: this.size.width == null ? 0 : this.size.width,
      height,
    };

    const validChildren = Array.isArray(this.children) ? this.children : [];

    return (
      // @ts-ignore
      <transition-group-plus
        transition-mode="out-in"
        tag={component}
        style={{
          position: 'relative',
          height: `${height}px`,
        }}
        id={ELEMENT_ID}
        class={className}
        ref={this.handleRef()}
      >
        {validChildren.map((child: any, i: any) => (
          // @ts-ignore
          <GridItem
            {...rest}
            index={i}
            key={child.key}
            itemKey={child.key}
            component={itemComponent}
            rect={rects[i]}
            appearDelay={appearDelay}
            appear={appear}
            appeared={appeared}
            enter={enter}
            entered={entered}
            leaved={leaved}
            containerSize={containerSize}
            mountedCb={this.handleItemMounted}
            unmountCb={this.handleItemUnmount}
            duration={duration}
            rtl={rtl}
            easing={easing}
            units={units}
            vendorPrefix={vendorPrefix}
            ref={child.key}
          >
            {child}
          </GridItem>
        ))}
        {/* 
      // @ts-ignore */}
      </transition-group-plus>
    );
  },
});

/**
 * MetalGrid Component
 */
export default Vue.extend({
  name: 'MetalGrid',

  props: Props,

  data() {
    return {
      gridInline: {
        updateLayout: () => {},
      } as any,
    };
  },

  methods: {
    updateLayout() {
      this.gridInline.updateLayout();
    },

    handleRef(gridInline: any) {
      this.gridInline = gridInline;

      if (typeof this.$props.gridRef === 'function') {
        this.$props.gridRef(this);
      }
    },
  },

  render(h) {
    const {
      className,
      component,
      itemComponent,
      columnWidth,
      enableSSR,
      gutterWidth,
      gutterHeight,
      appearDelay,
      monitorImagesLoaded,
      layoutCb,
      duration,
      rtl,
    } = this.$props;

    return (
      // @ts-ignore
      <GridInline
        className={className}
        component={component}
        itemComponent={itemComponent}
        columnWidth={columnWidth}
        gutterWidth={gutterWidth}
        gutterHeight={gutterHeight}
        appearDelay={appearDelay}
        monitorImagesLoaded={monitorImagesLoaded}
        layoutCb={layoutCb}
        duration={duration}
        enableSSR={enableSSR}
        rtl={rtl}
        refCallback={this.handleRef}
        children={this.$slots.default}
      />
    );
  },
});
