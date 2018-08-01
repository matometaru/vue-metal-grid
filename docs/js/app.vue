<template>
	<div id="app">
		<navbar></navbar>
		<div class="container">
			<router-view></router-view>
		</div>
		<democontrol></democontrol>
	</div>
</template>

<script>
export default {
	components: {
		navbar: require('./components/Navbar.vue'),
		democontrol: require('./components/DemoControl.vue')
	},
}
</script>

<style lang="scss" scoped>
.container {
	padding: 100px 0 120px;
}
</style>