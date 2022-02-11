<script>
export default {
  name: 'SubmitButton'
}
</script>

<template>
	<input class="btn" v-on="$attrs" type="button" value="">
</template>

<style scoped lang="css">
.btn {
    padding: 3px;
    height: 80px;
    font-size: 28px;
    color: #ffffff;
	background-color: #122542;
    border-radius: 37px;
    border: none;
    &:hover{
        background-color : #1f447c;
    }
}
@media screen and (min-width:1024px){
    .btn {
        font-size: 25px;
    }
}
</style>