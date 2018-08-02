<template>
	<MetalGrid
		className="metal"
		style="style"
		component="ul"
		itemComponent="li"
		:rtl="true"
		:appearDelay="200"
		:columnWidth="wrapperSize.width <= 768 ? '100%' : size.columnWidth"
		:duration="size.duration"
		:gutterWidth="size.gutter"
		:gutterHeight="size.gutter"
		ref="grid"
	>
		<template v-for="item in items">
			<div
				:key="item.id"
				@click="removeItem(item.id)"
			>
				<p class="date">{{item.id}}</p>
				<p class="date">{{item.date}}</p>
				<h2 class="tit">{{item.title}}</h2>
			</div>
		</template>
	</MetalGrid>
</template>

<script>
import Vue from 'vue'
import MetalGrid from '../../../src/'
import elementResizeDetectorMaker from 'element-resize-detector';
import sizeStore from '../stores/sizeStore'
import bus from '../bus'

export default {
	components: {
		MetalGrid: require('../../../src/').default
	},
	data() {
		return {
			style: {
				background: "#ddd",
			},
			size: sizeStore.get(),
			items: [
				{ id: 1, title: 'ここに記事のタイトルが入ります。', date: '2018/07/21' },
				{ id: 2, title: 'ここに記事のタイトルが入ります。', date: '2018/07/23' },
				{ id: 3, title: 'ここに記事のタイトルが入ります。ここに記事のタイトルが入ります。', date: '2018/07/25' },
				{ id: 4, title: 'ここに記事のタイトルが入ります。', date: '2018/07/26' },
				{ id: 5, title: 'ここに記事のタイトルが入ります。', date: '2018/07/27' },
				{ id: 6, title: 'ここに記事のタイトルが入ります。ここに記事のタイトルが入ります。', date: '2018/07/28' },
				{ id: 7, title: 'ここに記事のタイトルが入ります。', date: '2018/07/31' },
			],
			wrapperSize: {
				width: 0,
			},
		}
	},
	mounted() {
		this.wrapperSize.width = 1000;
		this.$nextTick(function () {
			const erd = elementResizeDetectorMaker({
				strategy: "scroll"
			});
			erd.listenTo(this.$refs.grid.$el, (element) => {
				this.wrapperSize = { width: element.offsetWidth }
			});
		});
		bus.$on('shuffle', function() {
			console.log("shuffle")
		});
		bus.$on('prepend', function() {
			console.log("prepend")
		});
		bus.$on('append', () => {
			this.addItem();
		});
	},
	methods: {
		removeItem(id) {
			console.log(id)
			this.items = this.items.filter(o => o.id !== id)
		},
		addItem(id) {
			this.items.push({ id: this.items.length+1, title: 'ここに記事のタイトルが入ります。', date: '2018/08/01' })
		},
	},
}
</script>