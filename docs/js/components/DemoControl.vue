<template>
	<div class="demo-control">
		<div class="demo-control-button">
			<button @click="onShuffle">Shuffle</button>
		</div>
		<div class="demo-control-button">
			<button @click="onPrepend">Prepend</button>
		</div>
		<div class="demo-control-button">
			<button @click="onAppend">Append</button>
		</div>
		<div class="demo-control-slider">
			<vue-slider
				ref="sliderDuration"
				v-model="size.duration"
				:width="140"
				:min="100"
				:max="2000"
				@callback="cb">
			</vue-slider>
		</div>
		<div class="demo-control-slider">
			<vue-slider ref="sliderColumn"
				v-model="size.columnWidth"
				:width="140"
				:min="100"
				:max="300">
			</vue-slider>
		</div>
		<div class="demo-control-slider">
			<vue-slider ref="sliderGutter"
				v-model="size.gutter"
				:width="140">
			</vue-slider>
		</div>
	</div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import sizeStore from '../stores/sizeStore'
import bus from '../bus'

export default {
	mounted() {
	},
	data () {
		return {
			size: sizeStore.get(),
		}
	},
	methods: {
		cb: function() {
			sizeStore.set(this.size);
		},
		onShuffle: function() {
			bus.$emit('shuffle')
		},
		onPrepend: function() {
			bus.$emit('prepend')
		},
		onAppend: function() {
			bus.$emit('append')
		}
	},	
	components: {
		vueSlider
	},
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Geo');
.demo-control {
	font-family: 'Geo', sans-serif;
	display: table;
	position: fixed;
	z-index: 100;
	bottom: 0;
	left: 0;
	width: 100%;
	min-width: 1000px;
	background: #bababa;
	padding: 25px 20px;
	&-button,
	&-slider {
		display: table-cell;
		vertical-align: middle;
	}
	&-button {
		button {
			display: inline-block;
			padding: 0 2em;
			background: #fff;
			border: none;
			color: #bababa;
			font-size: 22px;
			font-weight: bold;
			text-align: center;
			line-height: 40px;
			white-space: nowrap;
			vertical-align: middle;
			cursor: pointer;
		}
	}
	&-slider {
		.vue-slider-tooltip {
			background: #000;
			border-color: #000;
		}
		.vue-slider-process {
			background: #000;
		}
	}
}
</style>