import Vue from 'vue'
import { transition, buildStyles } from '../utils/style-helper';

const Props = {
	index: Number,
	itemKey: [Number, String],
	component: {
		type: String,
		default: 'span'
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
}

const getTransitionStyles = (type, props) => {
	const { rect, containerSize, index } = props;

	return props[type](rect, containerSize, index);
};

const getPositionStyles = (rect, zIndex, rtl) => ({
	translateX: `${rtl ? -Math.round(rect.left) : Math.round(rect.left)}px`,
	translateY: `${Math.round(rect.top)}px`,
	zIndex,
});

export default Vue.extend({

	name: "GridItem",

	props: Props,

	data() {
		return {
			appearTimer: null,
			node: null,
			state: {
				...getPositionStyles(this.$props.rect, 1, this.$props.rtl),
				...getTransitionStyles('appear', this.$props),
			}
		}
	},

	watch: {
		rect: function() {
			this.setStateIfNeeded({
				...this.state,
				...getPositionStyles(this.$props.rect, 2, this.$props.rtl),
			});
		}
	},

	mounted() {
		setTimeout(
			this.setAppearedStyles
		, this.$props.appearDelay * this.$props.index );
		this.$props.mountedCb(this);
	},

	destroyed() {
		this.$props.unmountCb(this);
	},

	methods: {

		/**
		 * 状態セット
		 */
		setStateIfNeeded(state) {
			this.state = state;
		},

		/**
		 * 初回表示時の状態設定
		 */
		setAppearedStyles() {
			this.setStateIfNeeded({
				...this.state,
				...getTransitionStyles('appeared', this.$props),
				...getPositionStyles(this.$props.rect, 1, this.$props.rtl),
			});
		},

		/**
		 * 追加時の状態設定
		 */
		setEnterStyles() {
			this.setStateIfNeeded({
				...this.state,
				...getPositionStyles(this.$props.rect, 2, this.$props.rtl),
				...getTransitionStyles('enter', this.$props),
			});
		},

		/**
		 * 追加完了時の状態設定
		 */
		setEnteredStyles() {
			this.setStateIfNeeded({
				...this.state,
				...getTransitionStyles('entered', this.$props),
				...getPositionStyles(this.$props.rect, 1, this.$props.rtl),
			});
		},

		/**
		 * 削除時の状態設定
		 */
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
		 * @return {Object} { zIndex: 1, opacity: 1, display: "block", transform: "translateX(15px) translateY(0px)", … }
		 */
		getStyles() {
			const {
				itemKey,
				rect,
				duration,
				easing,
				units,
				vendorPrefix,
				userAgent,
				rtl,
				...rest
			} = this.$props;

			const styles = buildStyles({
				...this.state,
				display: 'block',
				position: 'absolute',
				top: 0,
      			...(rtl ? { right: 0 } : { left: 0 }),
				width: `${rect.width}px`,
				transition: transition(['opacity', 'transform'], duration, easing),
			}, units, vendorPrefix, userAgent);

			return styles;
		},

		/**
		 * styleオブジェクトに設定する
		 */
		setStyles(el,styles) {
			for(let key in styles) {
				el.style[key] = styles[key]; 
			}
		},

		/**
		 * アニメーションフック
		 * enter, afterEnter, leave
		 */
		onBeforeEnter(el) {
			this.setEnterStyles();
		},

		onEnter(el, done) {
			this.setEnteredStyles();
		},

		onLeave(el, done) {
			this.setLeaveStyles();
			// stylesのオブジェクトを取得
			const styles = this.getStyles();
			// elにスタイル設定。
			this.setStyles(el,styles);
			// setTimeoutでduration後にdoneするか、transitionendイベントで完了。 
			setTimeout(done, this.$props.duration);
		},

	},

	render (h) {

		const {
			index,
			component: Element,
			containerSize,
			appearDelay,
			appear,
			appeared,
			enter,
			entered,
			leaved,
			itemKey,
			rect,
			duration,
			easing,
			units,
			vendorPrefix,
			userAgent,
			rtl,
			...rest
		} = this.$props;

		const style = this.getStyles();

		return (
			<transition-plus
				beforeEnter={this.onBeforeEnter}
				onEnter={this.onEnter}
				onLeave={this.onLeave}>
				<Element
					style={style}
				>
					{this.$slots.default}
				</Element>
			</transition-plus>
		)
	}

})