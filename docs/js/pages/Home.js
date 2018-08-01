import Vue from 'vue'
import MetalGrid from '../../../src/'
import elementResizeDetectorMaker from 'element-resize-detector';
import sizeStore from '../stores/sizeStore'
import bus from '../bus'

export default {
	data() {
		return {
			size: sizeStore.get(),
			grid: {},
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
			erd.listenTo(this.grid.$el, (element) => {
				this.wrapperSize = { width: element.offsetWidth }
			});
		});
		bus.$on('shuffle', function() {
			window.alert("shuffle")
		});
		bus.$on('prepend', function() {
			window.alert("prepend")
		});
		bus.$on('append', function() {
			window.alert("append")
		});
	},
	methods: {
		removeItem(id) {
			this.items = this.items.filter(o => o.id !== id)
		},
		addItem(id) {
			this.articles.push({ id: this.items.length+1, title: 'ここに記事のタイトルが入ります。', date: '2018/08/01' })
		},
	},
	render (h) {
		return (
			<MetalGrid
				columnWidth={this.wrapperSize.width <= 768 ? '100%' : this.size.columnWidth}
				duration={this.size.duration}
				gutterWidth={this.size.gutter}
				gutterHeight={this.size.gutter}
				gridRef={grid => this.grid = grid}
			>
				{this.items.map(item => 
					(
						<div
							key={item.id}
							onClick={() => this.removeItem(item.id)}
						>
							<p class="date">{item.date}</p>
							<h2 class="tit">{item.title}</h2>
						</div>
					)
				)}
			</MetalGrid>
		)
	}
}