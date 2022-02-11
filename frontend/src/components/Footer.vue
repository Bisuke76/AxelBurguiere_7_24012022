<template>
	<footer>
		<h3>{{copyright}}</h3>
	</footer>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default {
		name: 'Footer',
		computed:{
			...mapGetters(['copyright'])
		}
	}
</script>

<style scoped lang="css">
footer{
	margin-left: 2%;
}
h3{
   color:#122542;
   font-size:20px;
}
</style>