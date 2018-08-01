<script>
import Vue from 'vue'
import MetalGrid from '../../../src/'

export default {
	data() {
		return {
			grid: {},
			items: [
				{ id: 1, src: './images/photos/photo01.jpg', label: 'Sample image 1' },
				{ id: 2, src: './images/photos/photo02.jpg', label: 'Sample image 2' },
				{ id: 3, src: './images/photos/photo03.jpg', label: 'Sample image 3' },
				{ id: 4, src: './images/photos/photo04.jpg', label: 'Sample image 4' },
				{ id: 5, src: './images/photos/photo05.jpg', label: 'Sample image 5' },
				{ id: 6, src: './images/photos/photo06.jpg', label: 'Sample image 6' },
				{ id: 7, src: './images/photos/photo07.jpg', label: 'Sample image 7' },
			],
		}
	},
	methods: {
		removeItem(id) {
			this.items = this.items.filter(o => o.id !== id)
		},
	},
	render (h) {
		return (
			<MetalGrid
				monitorImagesLoaded
				columnWidth={300}
				duration={600}
				gutterWidth={15}
				gutterHeight={15}
				appearDelay={60}
				gridRef={grid => this.grid = grid}
			>
			{this.items.map(item => 
				(
					<div
						key={item.src}
						onClick={() => this.removeItem(item.id)}
					>
						<img src={item.src} alt={item.label} />
					</div>
				)
			)}
			</MetalGrid>
		)
	}
}
</script>

<style scoped>
img {
	width: 100%;
	height: auto;
}
</style>