<script>
    const axios = require('axios')
    import SubmitButton from "../components/SubmitButton.vue"
    import { mapActions } from "vuex"
    export default {
        name: "Login",
        components: {
            SubmitButton
        },
        computed : {
            password:{
                // getter
                get: function () {
                    return this.$store.state.login_signup.passwordone;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.login_signup.passwordone = newValue;
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
            ...mapActions(['userPostLogin']),
        },
        beforeCreate(){
            //If user connected
            let userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            if (userStorage != null) {
                window.location.href = 'http://localhost:8080/Activity';
            }
            userStorage = JSON.parse(sessionStorage.getItem('user'))
            let emailRg = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
            //If signup => automatic connection
            if (userStorage != null) {
                let email_valid = emailRg.test(userStorage.email)
                //if email valid
                if (email_valid) {
                    axios.post('http://localhost:3000/api/auth/login', {
                        password: userStorage.password,
                        email: userStorage.email,
                    })
                    .then(response => {
                        //Delete sessionStorage "user"
                        sessionStorage.removeItem('user');
                        let user = {
                            id : response.data.userId,
                            roleId : response.data.roleId,
                            sex: response.data.sex,
                            img: response.data.image,
                            token : response.data.token
                        }
                        //send info in sessionStorage and redirection
                        let userItems = JSON.stringify(user)
                        sessionStorage.setItem('userToken', userItems)
                        window.location.href = 'http://localhost:8080/Activity'
                    })
                    .catch(error => {
                        alert(`Le mot de passe ou l'utilisateur n'est pas valide. ${error}`)
                    });
                }
                else {
                    alert("Le formulaire n'est pas valide. Vérifer que l'adresse mail est valide")
                }
            }
        },
        mounted(){
            document.title = 'Connexion'
        }
    }
</script>

<template>
	<main>
		<h1>SE CONNECTER</h1>
		<form>
            <!-- Email -->
			<label for="email">Email</label>
			<input type="email" name="email" id="email" placeholder="Tapez votre adresse Email" autofocus required v-model="email">

            <!-- Password -->
			<label for="password">Mot de passe</label>
			<input type="password" id="password" name="passeword" placeholder="Tapez votre mot de passe" required v-model="password">

            <!-- Button -->
            <SubmitButton class="btn-custom" @click="userPostLogin" value="Se connecter"/>
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
    border: 3px #1f71ee solid;
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