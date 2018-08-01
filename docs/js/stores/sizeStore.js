export default {
	state: {
		duration: 100,
		columnWidth: 240,
		gutter: 10,
	},
	set (val) {
		this.state = val;
	},
	get () {
		return this.state;
	}
}