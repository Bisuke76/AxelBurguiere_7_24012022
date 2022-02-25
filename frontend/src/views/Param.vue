<script>
    import SubmitButton from "../components/SubmitButton.vue"
    import { mapActions } from "vuex"
    export default {
        name: "Login",
        data(){
            return{
                param : "",
                user_pointer_id :"",
                user_id : "",
                role:""
            }
        },
        components: {
            SubmitButton
        },
        computed : {
            username:{
                // getter
                get: function () {
                    return this.$store.state.param.username;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.username = newValue;
                }
            },
            email:{
                // getter
                get: function () {
                    return this.$store.state.param.email;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.email = newValue;
                }
            },
            biography:{
                // getter
                get: function () {
                    return this.$store.state.param.biography;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.biography = newValue;
                }
            },
            oldpassword:{
                // getter
                get: function () {
                    return this.$store.state.param.oldpassword;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.oldpassword = newValue;
                }
            },
            newpasswordone:{
                // getter
                get: function () {
                    return this.$store.state.param.newpasswordone;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.newpasswordone = newValue;
                }
            },
            newpasswordtwo:{
                // getter
                get: function () {
                    return this.$store.state.param.newpasswordtwo;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.newpasswordtwo = newValue;
                }
            }
        },
        methods : {
            ...mapActions(['putParamEdit', 'putPassWordEdit', 'deleteUserDelete']),
            addImage(event) {
                this.$store.state.param.imageUser = event.target.files[0]
            }
        },
        beforeCreate(){
            //If user connected
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            if (userStorage === null) {
                window.location.href = 'http://localhost:8080';
            }
        },
        beforeMount(){
            const axios = require('axios')
            let userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            this.user_id = userStorage.id
            this.role = userStorage.roleId
            this.user_pointer_id = this.$route.params.id
            //get Param
            axios.get(`http://localhost:3000/api/param/${this.user_pointer_id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
            .then(param => {
                this.param = param.data
                this.$store.state.param.username = this.param.username
                this.$store.state.param.email = this.param.email
                this.$store.state.param.biography = this.param.biography
                this.$store.state.user_id_pointed = this.param.id
            })
            .catch(error => {
                alert(`Quelque chose c'est mal passé. Essayez à nouveau ${error}`)
            });
        },
        mounted(){
            document.title = 'Paramètre'
        }
    }
</script>

<template>
    <main>
        <!-- User Image and Username -->
        <aside>
            <div class="user_img">
                <img v-if="param.image" :src="param.image" title="Tableau de bord">
                <img v-else-if="param.sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
            </div>
            <p>{{param.username}}</p>
        </aside>

        <!-- Forms -->
        <section>
            <div class="form">

                <!-- User param -->
                <form v-if="user_id == user_pointer_id">
                    <h2>MON COMPTE</h2>

                    <!-- Username -->
                    <label for="username">Nom d'utilisateur</label>
                    <input type="text" name="username" id="username" placeholder="Nom d'utilisateur" required v-model="username">

                    <!-- Email -->
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="Adresse Email" required v-model="email">

                    <!-- Biography -->
                    <label for="biography">Biographie</label>
                    <textarea name="biography" id="biography" placeholder="Votre Biographie" required v-model="biography"></textarea>

                    <!-- Image -->
                    <label for="myfile">Photo de Profil</label>
                    <input @change="addImage" type="file" id="myfile" name="myfile" accept= "image/*">

                    <SubmitButton class="btn-custom" @click="putParamEdit" value="Enregistrer"/>
                </form>

                <!-- User Password -->
                <form v-if="user_id == user_pointer_id">
                    <h2>MOT DE PASSE</h2>

                    <!-- Old password -->
                    <label for="oldpasseword">Ancien mot de passe</label>
                    <input type="password" id="oldpassword" name="oldpasseword" placeholder="Ancien mot de passe" required v-model="oldpassword">

                    <!-- New password -->
                    <label for="newpassewordone">Nouveau mot de passe</label>
                    <input type="password" id="newpasswordone" name="newpasswordone" placeholder="Nouveau mot de passe" required v-model="newpasswordone">

                    <!-- New password confirmation -->
                    <label for="newpassewordtwo">Confirmation du mot de passe</label>
                    <input type="password" id="newpasswordtwo" name="newpasswordtwo" placeholder="Confirmer le mot de passe" required v-model="newpasswordtwo">

                    <SubmitButton class="btn-custom" @click="putPassWordEdit" value="Enregistrer"/>
                </form>
            </div>

            <!-- Delete User -->
            <SubmitButton v-if="role === 2" class="btn-custom btn-alert" @click="deleteUserDelete" value="Supprimer le compte"/>
            <SubmitButton v-else-if="user_id == user_pointer_id" class="btn-custom btn-alert" @click="deleteUserDelete" value="Supprimer le compte"/>
        </section>
    </main>
</template>

<style scoped lang="scss">
main{
    margin-bottom: 2%;
}
main, aside, section{
    display: flex;
    flex-direction: column;
    align-items: center;
}
p{
    font-size: 2em;
    color: #fd2d01;
    margin: 10px;
}
section{
    width: 85%;
}
/* User profil */
    .user_img{
        overflow: hidden;
        width: 150px;
        height: 150px;
        border-radius: 100px;
        border: 2px #d1515a solid;
        background-color: #ffd7d7;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        img{
            width: 240px;
            height: auto;
        }
        &:hover{
            border: 2px #ffd7d7 solid;
        }
    }
    #no_image_user{
        width: 100%;
    }
/*Form*/
    h2{
        color: #ffffff;
        display: flex;
        justify-content: center;
        font-size: 2em;
        margin: 1em;
    }
    .form{
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    form{
        align-self: center;
        background-color: rgba(18, 37, 66, 0.6);
        padding: 30px;
        border-radius: 30px;
        display: flex;
        flex-direction: column;
        width: 80%;
        margin-bottom: 10%;
    }
    label{
        color: #d1515a;
        font-size: 25px;
    }
    input, textarea {
        margin: 10px 0 50px 0;
        font-size: 23px;
    }
    textarea,
    input[type=text],
    input[type=email],
    input[type=password]{
        color: black;
        border: 3px #1f71ee solid;
        border-radius: 20px;
        padding-left: 10px;
        width: 100%;
        height: 75px;
        font-family: Arial;
    }
    textarea{
        padding: 10px 10px 5px 10px;
        height: 65px;
    }
    .btn-custom {
        margin: auto;
        width: 300px;
        font-size: 28px;
        font-family: arial;
        box-shadow: -4px 4px 10px black;
        background-color: #fd2d01;
        &:hover{
            margin-bottom: -2px;
            margin-top: 2px;
            box-shadow: none;
            background-color: #ea5232;
        }
    }
    .btn-alert{
        background-color: #b00;
        box-shadow: none;
        &:hover{
            margin: 0;
            background-color: #f00;
        }
    }
@media screen and (min-width:1024px){
section{
    width: 70%;
}
/*Form*/
    .form{
        flex-direction: row;
        justify-content: space-between;
    }
    form{
        align-self: flex-start;
        width: 43%;
        margin-bottom: 2%;
    }
}
</style>