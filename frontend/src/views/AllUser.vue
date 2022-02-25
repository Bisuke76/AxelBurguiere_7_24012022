<script>
    import SubmitButton from "../components/SubmitButton.vue"
    export default {
        name: "AllUser",
        data(){
            return{
                role:"",
                sex : "",
                user_id :"",
                users:""
            }
        },
        components: {
            SubmitButton
        },
        computed : {},
        methods : {},
        beforeCreate(){
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            if (userStorage === null) {
                window.location.href = 'http://localhost:8080';
            }
        },
        beforeMount(){
            const axios = require('axios')
            let userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            this.sex = userStorage.sex
            this.user_id = userStorage.id
            this.role = userStorage.roleId
            axios.get('http://localhost:3000/api/param/', {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
            .then(users => {
                this.users = users.data
            })
            .catch(error => {
                alert(`Quelque chose c'est mal passé. Essayez à nouveau ${error}`)
            });
        },
        mounted(){
            document.title = 'Tous les utilisateurs'
        }
    }
</script>

<template>
    <main>
        <div v-for="item in users" :key="item.id" class="user">
            <div class="user_info">
                <router-link :to="{name: 'User', params: { id: item.id }}" class="user_img">
                    <img v-if="item.image" :src="item.image" title="Tableau de bord">
                    <img v-else-if="item.sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                    <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
                </router-link>

                <div>
                    <div class="info">
                        <h2>{{ item.username}}</h2>
                        <i v-if="item.sex === 'F'" class="fas fa-venus"></i>
                        <i v-else class="fas fa-mars"></i>
                    </div>

                    <div class="info">
                        <p v-if="item.roleId === 2" class="role">Admin</p>
                        <p v-else class="role">Employé</p>

                        <p>{{ item.email }}</p>
                    </div>
                </div>
            </div>

            <router-link :to="{name: 'Parametre', params: { id: item.id }}"><SubmitButton class="btn-custom" value="Supprimer"/></router-link>
        </div>
    </main>
</template>

<style scoped lang="scss">
main{
    display: flex;
    flex-direction: column;
    margin: 0 4%;
}
a{
    width: 60%;
}
h2{
    color: #fd2d01;
    font-size: 1.6em;
    font-weight: 100;
}
p{
    color: white;
}
i{
    font-size: 1.6em;
    color: #d1515a;
    margin-left: 10px;
}
.user{
    background-color: #122542;
    border-radius: 10px;
    padding: 2%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
    &_info{
        width: 100%;
        display: flex;
        justify-content: space-between;
        div{
            width: 85%;
            margin-left: 5px;
        }
    }
}
.info{
    display: flex;
    width: 100%;
    margin-bottom: 1%;
}
.user_img{
    overflow: hidden;
    width: 50px;
    height: 50px;
    border-radius: 100px;
    border: 2px #d1515a solid;
    background-color: #ffd7d7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    img{
        width: 90px;
        height: auto;
    }
    &:hover{
        border: 2px #ffd7d7 solid;
    }
}
#no_image_user{
    width: 100%;
}
.role{
    color: #fd2d01;
    margin-right: 10px;
}
.btn-custom{
    width: 100%;
    height: 40px;
    font-size: 1.2em;
    font-weight: bold;
    background-color: #d1515a;
    box-shadow: -4px 4px 10px black;
    margin: 5px 0 2px 0;
    &:hover{
        margin-bottom: 0px;
        margin-top: 7px;
        color: #d1515a;
        background-color: #ffd7d7;
        box-shadow: none;
    }
}
@media screen and (min-width:1024px){
    main{
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0 10%;
    }
    .user{
        width: 45%;
    }
    .user_img{
        width: 80px;
        height: 80px;
        img{
            width: 140px;
        }
    }
}
</style>