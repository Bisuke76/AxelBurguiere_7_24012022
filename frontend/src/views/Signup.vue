<script>
    import SubmitButton from "../components/SubmitButton.vue"
    import { mapActions } from "vuex"
    export default {
        name: "Login",
        components: {
            SubmitButton,
        },
        computed : {
            username:{
                // getter
                get: function () {
                    return this.$store.state.login_signup.username;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.login_signup.username = newValue;
                }
            },
            passwordone:{
                // getter
                get: function () {
                    return this.$store.state.login_signup.passwordone;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.login_signup.passwordone = newValue;
                }
            },
            passwordtwo:{
                // getter
                get: function () {
                    return this.$store.state.login_signup.passwordtwo;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.login_signup.passwordtwo = newValue;
                }
            },
            email:{
                // getter
                get: function () {
                    return this.$store.state.login_signup.email;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.login_signup.email = newValue;
                }
            }
        },
        methods : {
            user_is_a_man(){
                this.$store.commit("USER_MAN")
            },
            user_is_a_woman(){
                this.$store.commit("USER_WOMAN")
            },
            ...mapActions(['userPostSignup']),
        },
        beforeCreate(){
            //If user connected
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            if (userStorage != null) {
                window.location.href = 'http://localhost:8080/Activity';
            }
        },
        mounted(){
            document.title = 'Inscription'
        },
    }
</script>

<template>
    <main>
        <h1>S'INSCRIRE</h1>
        <form>
            <!-- Username -->
            <label for="username">Nom d'utilisateur*</label>
            <input type="text" id="username" name="username" placeholder="Tapez votre nom d'utilisateur" autofocus required v-model="username">

            <!-- Email -->
            <label for="email">Email*</label>
            <input type="email" id="email" name="email" placeholder="Taper votre adresse Email" required v-model="email">

            <!-- Password One -->
            <label for="password-one">Mot de passe*</label>
            <input type="password" id="password-one" name="password_one" placeholder="Tapez votre mot de passe" required v-model="passwordone">

            <!-- Password Two -->
            <label for="password-two">Confirmation du mot de passe*</label>
            <input type="password" id="password-two" name="password_two" placeholder="Confirmer le mot de passe" required v-model="passwordtwo">

            <!-- Sex -->
            <label for="genre">Genre*</label><br/>
            <div class="genre">
                <div>
                    <input type="radio" id="genre" name="genre" value="homme" required @click="user_is_a_man"/>
                    <label for="genre">Homme</label>
                </div>
                <div>
                    <input type="radio" id="genre" name="genre" value="femme" required @click="user_is_a_woman"/>
                    <label for="genre">Femme</label>
                </div>
            </div>

            <!-- Button -->
            <SubmitButton class="btn-custom" @click="userPostSignup" value="S'inscrire"/>
        </form>
    </main>
</template>

<style scoped lang="css">
main{
    margin: 0 30px;
}
h1{
    color:#ffffff;
    margin: 60px 0 70px 0;
}
label{
    color: #d1515a;
    font-size: 25px;
}
input{
    border: 3px #288825 solid;
    border-radius: 20px;
    margin: 10px 0 80px 0;
    padding: 3px;
    width: 97%;
    height: 70px;
    font-size: 25px;
    &:invalid {
        border-color: #fd2d01;
    }
}
.genre{
    width: 100%;
    display: flex;
    justify-content: space-around;
}
#genre{
    width: 25%;
    margin: 30px;
}
.btn-custom{
    margin: 40px 0 80px;
    width: 300px;
}
@media screen and (min-width:1024px){
    main{
        margin: 0 28%;
    }
    input{
        margin: 20px 0 90px 0;
        width: 100%;
        height: 55px;
    }
    .btn-custom{
        margin: 100px 0 80px;
        width: 250px;
    }
}
</style>