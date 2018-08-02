import Vue from 'vue'
import ExecutionEnvironment from 'exenv';
import GridItem from './GridItem'
import { transition, buildStyles } from '../utils/style-helper';
import { raf } from '../animations/request-animation-frame';
import * as easings from '../animations/easings';
import * as transitions from '../animations/transitions/';

import VueTransitionGroupPlus from "./vue-transition-group-plus/index"
Vue.use(VueTransitionGroupPlus)

var elementResizeDetectorMaker = require("element-resize-detector");

const imagesLoaded = ExecutionEnvironment.canUseDOM ? require('imagesloaded') : null;

const isNumber = (v) => typeof v === 'number' && isFinite(v);
const isPercentageNumber = (v) => typeof v === 'string' && /^\d+(\.\d+)?%$/.test(v);

const Props = {
	className: String,
	css: {
		type: Object,
		default: () => {}
	},
	gridRef: Function,
	component: {
		type: String,
		default: 'div'
	},
	itemComponent: {
		type: String,
		default: 'span'
	},
	columnWidth: {
		type: [Number, String],
		default: 150
	},
	gutterWidth: {
		type: Number,
		default: 5
	},
	gutterHeight: {
		type: Number,
		default: 5
	},
	duration: {
		type: Number,
		default: 480
	},
	easing: {
		type: String,
		default: easings.quartOut 
	},
	appearDelay: {
		type: Number,
		default: 30
	},
	appear: {
		type: Function,
		default: transitions.fadeUp.appear
	},
	appeared: {
		type: Function,
		default: transitions.fadeUp.appeared
	},
	enter: {
		type: Function,
		default: transitions.fadeUp.enter
	},
	entered: {
		type: Function,
		default: transitions.fadeUp.entered
	},
	leaved: {
		type: Function,
		default: transitions.fadeUp.leaved
	},
	units: {
		type: Object,
		default: function() { return { length: 'px', angle: 'deg'} },
	},
	monitorImagesLoaded: {
		type: Boolean,
		default: false
	},
	vendorPrefix: {
		type: Boolean,
		default: true
	},
	enableSSR: {
		type: Boolean,
		default: false
	},
	layoutCb: {
		type: Function,
		default: null
	},
	rtl: {
		type: Boolean,
		default: false
	}
}

const InlineProps = Object.assign(Props , {
	children: Array,
	refCallback: Function
})

/**
 * getColumnLengthAndWidth
 * return [maxColumn, columnWidth]
 */
const getColumnLengthAndWidth = (width, value, gutter) => {

	if (isNumber(value)) {
		const columnWidth = parseFloat(value);

		return [
			Math.floor((width - (((width / columnWidth) - 1) * gutter)) / columnWidth),
			columnWidth,
		];
	} else if (isPercentageNumber(value)) {
		const columnPercentage = parseFloat(value) / 100;
		const maxColumn = Math.floor(1 / columnPercentage);
		const columnWidth = (width - (gutter * (maxColumn - 1))) / maxColumn;

		return [
			maxColumn,
			columnWidth,
		];
	}

	invariant(false, 'Should be columnWidth is a number or percentage string.');
};

/**
 * GridInline Component
 */
const GridInline = {

	name: "GridInline",

	props: InlineProps,

	data() {
		return {
			items: {},
			imgLoad: {},
			size: {
				width: 1000,
				height: 1000
			},
			mounted: false,
			state: {},
		}
	},

	watch: {
		children: function(newVal, oldVal) {
			this.updateLayout(this.$props)
		}
	},

	created: function () {
		this.state = this.doLayout(this.$props);
	},

	/**
	 * ReactのcomponentDidMount()と同じタイミング
	 * ComponentがDOMツリーに追加された状態で呼ばれるので、
	 * DOMに関わる初期化処理を行いたい時に便利です。
	 */
	mounted() {
		this.updateLayout(this.props);
		this.mounted = true;
		this.$nextTick(function () {
			this.erd = elementResizeDetectorMaker({
				strategy: "scroll"
			});
			this.erd.listenTo(document.getElementById("metal-grid"), (element) => {
				this.size = { width: element.offsetWidth, height: element.offsetHeight }
				this.updateLayout(this.$props)
			});
		});
	},

	destroyed() {
		this.erd.uninstall(document.getElementById("metal-grid"))
	},

	methods: {

		/**
		 * itemの高さを返す
		 * 
		 * @param  {Object} this.childrenのitem
		 * @return {number} itemの高さ  	
		 */
		getItemHeight(item) {
			// 初期化時点では$refsにまだアクセスできないので、hasOwnPropertyで確認する。
			if (item.key && this.items.hasOwnProperty(item.key)) {
				const el = this.$refs[item.key].$el;
				// 数値のみ返す
				const candidate = [el.scrollHeight, el.clientHeight, el.offsetHeight, 0].filter(isNumber);
				// 一番大きい値を返す
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
		doLayout(props) {

			const results = this.doLayoutForClient(props);

			if (this.mounted && typeof this.$props.layoutCb === 'function') {
				this.$props.layoutCb();
			}

			return results;
		},

		/**
		 * this.stateを更新し、レンダリングを行う
		 */
		updateLayout() {
			this.state = this.doLayout(this.$props)
		},

		/**
		 * this.$propsから、各itemのスタイルを計算して返す
		 * 
		 * @param  {Object} PropsInline
		 * @return {Object} { rects, actualWidth, height, columnWidth }
		 */
		doLayoutForClient(props) {

			const {
				columnWidth: rawColumnWidth,
				gutterWidth,
				gutterHeight,
				horizontal,
			} = props;

			const containerWidth = this.size.width;

			// 
			const childArray = Array.isArray(this.children) ? this.children : [];
			const [maxColumn, columnWidth] = getColumnLengthAndWidth(
				containerWidth,
				rawColumnWidth,
				gutterWidth
			);
			// columnHeightsはgridArrayに該当するやつ。
			const columnHeights = Array(maxColumn).fill(0);

			let rects;

			/**
			 * gridArrayの各設定(x,endY)のロジック@
			 */
			rects = childArray.map((child) => {
				const column = columnHeights.indexOf(Math.min(...columnHeights));
				const height = this.getItemHeight(child);
				const left = (column * columnWidth) + (column * gutterWidth);
				const top = columnHeights[column];

				columnHeights[column] += Math.round(height) + gutterHeight;

				return { top, left, width: columnWidth, height };
			});

			const width = (maxColumn * columnWidth) + ((maxColumn - 1) * gutterWidth);
			const height = Math.max(...columnHeights) - gutterHeight;
			const finalRects = rects.map(o => ({
				...o,
				left: o.left + ((containerWidth - width) / 2),
			}));

			return { rects: finalRects, actualWidth: width, height, columnWidth };
		},

		/**
		 * GridItemコンポーネントのマウント時のコールバック関数
		 * 
		 * @param  {Object} GridItem
		 */
		handleItemMounted: function(item) {
			const { itemKey: key } = item.$props;
			this.items[key] = item;

			if (this.$props.monitorImagesLoaded && typeof imagesLoaded === 'function') {
				const node = item.$el;
				const imgLoad = imagesLoaded(node);

				imgLoad.once('always', () => raf(() => {
					this.updateLayout(this.$props);
				}));

				this.imgLoad[key] = imgLoad;
			}

			this.updateLayout(this.$props);
		},

		/**
		 * GridItemコンポーネントの破壊時のコールバック関数
		 * 
		 * @param  {Object} GridItem
		 */
		handleItemUnmount: function(item) {
			const { itemKey: key } = item.$props;

			if (this.items.hasOwnProperty(key)) {
				delete this.items[key];
			}

			if (this.imgLoad.hasOwnProperty(key)) {
				this.imgLoad[key].off('always');
				delete this.imgLoad[key];
			}
		},

		/**
		 * コールバック関数
		 */
		handleRef: function() {
			this.$props.refCallback(this);
		},

	},

	components: {
		'GridItem': GridItem,
	},

	render (h) {

		const {
			gutterWidth,
			gutterHeight,
			monitorImagesLoaded,
			enableSSR,
			horizontal,
			refCallback,
			className,
			component,
			itemComponent,
			children,
			duration,
			easing,
			units,
			vendorPrefix,
			userAgent,
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
			<transition-group-plus
				transition-mode="out-in"
				tag={component}
				style={{
					position: 'relative',
					height: height + 'px',
				}}
				id={"metal-grid"}
				class={className}
				ref={this.handleRef()}>
				{validChildren.map((child, i) => (
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
						ref={child.key}>
						{child}
					</GridItem>
				))}
			</transition-group-plus>
		)
	}

}

/**
 * MetalGrid Component
 */
export default {

	name: "MetalGrid",

	props: Props,

	methods: {

		updateLayout() {
			this.gridInline.updateLayout();
		},

		handleRef: function(gridInline) {
			this.gridInline = gridInline;

			if (typeof this.$props.gridRef === 'function') {
				this.$props.gridRef(this);
			}
		},
	},

	components: {
		'GridInline': GridInline,
	},

	render (h) {

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
			gridRef,
			duration,
			rtl,
			...rest
		} = this.$props;

		return (
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
				rtl={rtl}
				refCallback={this.handleRef}
				children={this.$slots.default}
			/>
		)
	}

}