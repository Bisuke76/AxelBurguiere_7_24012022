<script>
export default {
    name: "Header",
}
</script>

<template>
    <header>
        <nav>
            <div>
                <img src="../assets/icon.svg"> 
                <p>Groupomania</p>
            </div>
            <div id="lien">
                <router-link to="/Login">Se connecter</router-link>
                <router-link to="/Signup">S'inscrire</router-link>
            </div>
        </nav>
    </header>
</template>

<style scoped lang="css">
p{
    font-size: 30px;
    color: #fd2d01;
}
header{
    background-color: #122542;
    padding: 30px;
}
nav {
    a{
        font-size: 25px;
        color: white;
        text-decoration: none;
        margin: 0 20px;
        &:hover {
            color: #d1515a;
            border-bottom: 5px black solid;
        }
    }
    div:first-child{
        display: flex;
        align-items: center;
    }
}
img{
    width:50px;
}
#lien {
    text-align: right;
}
.router-link-exact-active{
    border-bottom: 3px #d1515a solid;
}
</style>