<script>
    import SubmitButton from "../components/SubmitButton.vue"
    import { mapActions } from "vuex"
    export default {
        name: "Login",
        data(){
            return{
                user_id :"",
                role:"",
                sex : "",
                img : "",
                comment:"",
            }
        },
        components: {
            SubmitButton
        },
        computed : {
            commentText:{
                // getter
                get: function () {
                    return this.comment.content;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.comment.text = newValue;
                }
            }
        },
        methods : {
            ...mapActions(['putCommentEdit', 'deleteCommentDelete']),
            changeToNormalMode(){
                this.$store.state.comment.text = ""
                window.location.href = 'http://localhost:8080/Activity';
            }
        },
        beforeCreate(){
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            if (userStorage === null) {
                window.location.href = 'http://localhost:8080';
            }
            this.$store.state.comment.id = this.$route.params.id
        },
        beforeMount(){
            //Init
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            const axios = require('axios')
            const moment = require('moment');
            moment().format();
            moment.locale('fr');
            //Fill in the data
            this.sex = userStorage.sex
            this.role = userStorage.roleId
            this.user_id = userStorage.id
            this.img = userStorage.img
            let comment_id = this.$route.params.id
            axios.get(`http://localhost:3000/api/comment/${comment_id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
                .then(comment => {
                    this.comment = comment.data
                    this.comment.date = moment(this.comment.date).format('Do MMMM YYYY à HH:mm')
                    if (this.user_id != this.comment.user.id){
                        if (this.role === 2) {
                            axios.delete(`http://localhost:3000/api/comment/${this.comment.id}`,{
                                headers:{
                                    'Authorization' : `Token ${userStorage.token}`
                                }
                            })
                            .then(() => {
                                window.location.href = 'http://localhost:8080/Activity';
                            })
                            .catch(error => {
                                alert(`Quelque chose c'est mal passé.${error}`)
                            })
                        }else{
                            window.location.href = 'http://localhost:8080/Activity';
                        }
                    }
                })
                .catch(error => {
                    alert(`Quelque chose c'est mal passé. Essayez à nouveau ${error}`)
                });
        },
        mounted(){
            document.title = `Modifier un commentaire`
        }
    }
</script>

<template>
    <main>
        <!-- Form -->
        <form>

            <!-- User Image and text -->
            <div class="text">
                <router-link :to="{name: 'User', params: { id: comment.user.id }}" class="user_img">
                    <img v-if="comment.user.image" :src="comment.user.image" title="Tableau de bord">
                    <img v-else-if="comment.user.sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                    <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
                </router-link>
                <textarea name="post" rows="1" v-model="commentText"></textarea>

                <i v-if="comment.user.id === user_id" class="fas fa-trash" title="Supprimer" @click="deleteCommentDelete"></i>
                <i v-else-if="role === 2" class="fas fa-trash" title="Supprimer" @click="deleteCommentDelete"></i>
            </div>

            <!-- Buttons -->
            <div class="text">
                <SubmitButton class="btn-custom" @click="changeToNormalMode" value="Annuler"/>
                <SubmitButton class="btn-custom" @click="putCommentEdit" value="Modifier"/>
            </div>
        </form>
    </main>
</template>

<style scoped lang="css">
main{
    margin-bottom: 3%;
}
form{
    margin-top: 40px;
    background-color: #122542;
    padding: 10px 20px;
    border-radius: 30px;
    margin : 0 4%;
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
a {
    text-decoration: none;
    cursor: pointer;
}
/*Form*/
    .text{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    textarea{
        color: #ffd7d7;
        background-color: rgba(2, 7, 13, 0.5);
        border: 2px #fd2d01 solid;
        border-radius: 40px;
        margin-left: 5px;
        margin-top: 10px;
        padding: 5%;
        height: 40px;
        width: 80%;
        font-size: 1.2em;
        font-family: Arial;
    }
    .btn-custom{
        width: 45%;
        height: 40px;
        font-size: 1.2em;
        font-weight: bold;
        background-color: #d1515a;
        box-shadow: -4px 4px 10px black;
        margin: 25px 0 2px 0;
        &:hover{
            margin-bottom: 0px;
            margin-top: 27px;
            color: #d1515a;
            background-color: #ffd7d7;
            box-shadow: none;
        }
    }
    .fa-trash{
        font-size: 1.8em;
        color: #d1515a;
        position: relative;
        top: -55px;
        &:hover{
            color: #ffd7d7;
        }
    }
@media screen and (min-width:1024px){
    form{
        margin-right: 20%;
        margin-left: 20%;
    }
    /*Form*/
        .text{
            flex-wrap: nowrap;
        }
        textarea{
            margin-top: 10px;
            padding: 2%;
            width: 75%;
        }
        .btn-custom{
            width: 150px;
        }
        .fa-trash{
            position: static;
        }
}
</style>