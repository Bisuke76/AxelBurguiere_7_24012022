<template>
	<div id="app">
		<div v-if="!connected">
			<Header/>
			<router-view/>
			<Footer/>
		</div>

		<Navigation v-else>
			<template v-slot:page>
          <router-view :key="$route.fullPath"/>
      </template>
		</Navigation>
	</div>
</template>

<style lang="css">
*{
  margin: 0;
  padding: 0;
}
body{
	font-family: arial;
	background-color:#02070d;
	font-size: 15px;
}
</style>

<script>
import Header from "./components/Header"
import Footer from "./components/Footer"
import Navigation from "./components/Navigation"
export default {
	name: "Login",
	data (){
		return {
			connected : false
		}
	},
	components: {
		Header,
		Footer,
		Navigation
	},
	beforeMount(){
		const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
		if (userStorage != null) {
			this.connected = true
		}
		else{
			this.connected = false
		}
	}
}
</script>