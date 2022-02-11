const axios = require('axios')
const moment = require('moment');
moment().format();
moment.locale('fr');

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		webSiteName :'Groupomania',
		login_signup:{
			username : "",
			passwordone : "",
			passwordtwo : "",
			sex : "",
			email : ""
		},
		param:{
			username : "",
			imageUser:"",
			email : "",
			biography:"",
			oldpassword:"",
			newpasswordone : "",
			newpasswordtwo : ""
		},
		post:{
			img : "",
			id : "",
			text : "",
		},
		comment:{
			id : "",
			text : "",
		},
		user_id_pointed: "",
		lettersRg : /^[-'a-zA-ZÀ-ÖØ-öø-ÿœ\s.]+$/,
		postsRg : /^[-'a-zA-Z0-9À-ÖØ-öø-ÿœ\s#!^$()?+*.:,|]+$/,
		emailRg : /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
	},
	getters:{
		copyright: (state) => {
			const currentYear = new Date().getFullYear()

			return `© ${state.webSiteName} ${currentYear}`
		}
	},
	mutations: {
		USER_MAN (state){
			state.login_signup.sex = "M"
		},
		USER_WOMAN (state){
			state.login_signup.sex = "F"
		},
	},
	actions: {
		userPostSignup(context){
			//Init RG
			let lettersRg = context.state.lettersRg
			let emailRg = context.state.emailRg

			//Username and email verification
			let username_valid = lettersRg.test(context.state.login_signup.username)
			let email_valid = emailRg.test(context.state.login_signup.email)

			//Compare Passwords
			if (context.state.login_signup.passwordone === context.state.login_signup.passwordtwo) {
				let password = context.state.login_signup.passwordone

				//If all is valid
				if (username_valid && email_valid) {

					//Send info to Back
					axios.post('http://localhost:3000/api/auth/signup', {
						username: context.state.login_signup.username,
						password: password,
						email: context.state.login_signup.email,
						sex : context.state.login_signup.sex
					})
					.then(() => {

						//Get info and send them to SessionStorage
						let user = {
							email : context.state.login_signup.email,
							password : password
						}

						let userItems = JSON.stringify(user)
						sessionStorage.setItem('user', userItems)
						window.location.href = 'http://localhost:8080/Login';
					})
					.catch(error => {
						alert(`Quelque chose c'est mal passé. Essayez à nouveau et vérifiez que la sécurité du mot de passe ne soit pas faible. ${error}`)
					});
				}
				else {
					alert("Le formulaire n'est pas valide. Les nombres sont interdis pour le username. Vérifer que l'adresse mail est valide")
				}
			}
			else {
				alert("Les mots de passe ne sont pas identiques")
			}
		},
		userPostLogin(context){
			//Init RG
			let emailRg = context.state.emailRg
			let password = context.state.login_signup.passwordone

			//Email verification
			let email_valid = emailRg.test(context.state.login_signup.email)

			//If email valid
			if (email_valid) {

				//Send info to Back
				axios.post('http://localhost:3000/api/auth/login', {
					password: password,
					email: context.state.login_signup.email,
				})
				.then(response => {

					//Remove SessionStorage
					sessionStorage.removeItem('user');

                    //Get info and send them to SessionStorage
                    let user = {
                        id : response.data.userId,
                        roleId : response.data.roleId,
                        sex: response.data.sex,
                        img: response.data.image,
                        token : response.data.token
                    }

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
		},
		userSignout(){
			sessionStorage.removeItem('userToken');
			window.location.href = 'http://localhost:8080/'
		},


		postPostCreate(context){
			//Init RG, content and Validation
			let rg = context.state.postsRg
			let image = context.state.post.img
			let content = context.state.post.text
			let content_valid = rg.test(content)

			//if content Valid
			if (content_valid) {

				//init Form, userStorage and post content
				let formData = new FormData()
				let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

				let post = {
					text : content,
					userid : userStorage.id
				}

				//Init info in FormData
				formData.append('content', JSON.stringify(post));
				if (image) {
					formData.append('image', image);
				}

				//Send info to Back
				axios.post('http://localhost:3000/api/post', formData, {
					headers:{
						'Content-Type': 'multipart/form-data',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(() => {
					window.location.reload();
				})
				.catch(error => {
					alert(`Quelque chose c'est mal passé.${error}`)
				})
			}else {
				alert("Le contenu du post n'est pas valide ou est inexistant")
			}
		},
		putPostEdit(context){
			//Init RG, content and Validation
			let rg = context.state.postsRg
			let post_id = context.state.post.id
			let image = context.state.post.img
			let content = context.state.post.text
			let content_valid = rg.test(content)

			//init Form and userStorage
			let formData = new FormData()
			let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

			//Init info in FormData
			if (image) {
				formData.append('image', image);
			}

			//If there is content
			if(content){
				if (content_valid) {

					//Init info in FormData
					let post = {
						text : content
					}
					formData.append('content', JSON.stringify(post));

					//Send info to Back
					axios.put(`http://localhost:3000/api/post/${post_id}`, formData, {
						headers:{
							'Content-Type': 'multipart/form-data',
							'Authorization' : `Token ${userStorage.token}`
						}
					})
					.then(() => {
						window.location.reload();
					})
					.catch(error => {
						alert(`Quelque chose c'est mal passé.${error}`)
					})
				}else {
					alert("Le contenu du post n'est pas valide")
				}

			//If there isn't content
			}else{
				//Send info to Back
				axios.put(`http://localhost:3000/api/post/${post_id}`, formData, {
					headers:{
						'Content-Type': 'multipart/form-data',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(() => {
					window.location.reload();
				})
				.catch(error => {
					alert(`Quelque chose c'est mal passé.${error}`)
				})
			}
		},
		deletePostDelete(context){
			//Init post_id, userStorage and Validation
			let post_id = context.state.post.id
			let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

			//Send info to Back
			axios.delete(`http://localhost:3000/api/post/${post_id}`,{
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
		},


		postCommentCreate(context){
			//Init RG, content and Validation
			let rg = context.state.postsRg
			let post_id = context.state.post.id
			let content = context.state.comment.text
			let content_valid = rg.test(content)

			//if content Valid
			if (content_valid) {

				//init userStorage and comment content
				let userStorage = JSON.parse(sessionStorage.getItem('userToken'))
				let comment = {
					text : content,
					userid : userStorage.id
				}

				//Send info to Back
				axios.post(`http://localhost:3000/api/comment/${post_id}`, comment, {
					headers:{
						'Content-Type': 'application/json',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(() => {
					window.location.reload();
				})
				.catch(error => {
					alert(`Quelque chose c'est mal passé.${error}`)
				})
			}else {
				alert("Le contenu du post n'est pas valide ou est inexistant")
			}
		},
		putCommentEdit(context){
			//Init RG, comment id, content and Validation
			let rg = context.state.postsRg
			let comment_id = context.state.comment.id
			let content = context.state.comment.text
			let content_valid = rg.test(content)

			//if content Valid
			if (content_valid) {

				//init userStorage and comment content
				let userStorage = JSON.parse(sessionStorage.getItem('userToken'))
				let comment = {
					text : content
				}

				//Send info to Back
				axios.put(`http://localhost:3000/api/comment/${comment_id}`, comment, {
					headers:{
						'Content-Type': 'application/json',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(() => {
					window.location.href = 'http://localhost:8080/Activity';
				})
				.catch(error => {
					alert(`Quelque chose c'est mal passé.${error}`)
				})
			}else {
				alert("Le contenu du post n'est pas valide ou est inexistant. Si aucune modification a été faite appuyer sur Annuler")
			}
		},
		deleteCommentDelete(context){
			//Init data
			let comment_id = context.state.comment.id
			let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

			//Send info to Back
			axios.delete(`http://localhost:3000/api/comment/${comment_id}`,{
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
		},


		putParamEdit(context){
			//Init RG
			let lettersRg = context.state.lettersRg
			let emailRg = context.state.emailRg
			let textRg = context.state.postsRg

			//Init data
			let username = context.state.param.username
			let image = context.state.param.imageUser
			let email = context.state.param.email
			let biography = context.state.param.biography
			let user_id = context.state.user_id_pointed

			//Init validation
			let username_valid = lettersRg.test(username)
			let biography_valid = textRg.test(biography)
			let email_valid = emailRg.test(email)

			//if Username and email valid
			if (username_valid && email_valid) {

				//Init Form and userStorage
				let formData = new FormData()
				let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

				//Init param with all options
				let param = {
					username : username,
					email : email,
				}

				if (biography) {
					if (biography_valid) {
						param.biography = biography
					}else{
						alert("Les modifications ne sont pas valides")
					}
				}else{
					param.biography = ""
				}

				//Init Formdata
				formData.append('content', JSON.stringify(param));
				if (image) {
					formData.append('image', image);
				}

				//Send info to Back
				axios.put(`http://localhost:3000/api/param/user/${user_id}`, formData, {
					headers:{
						'Content-Type': 'multipart/form-data',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(response => {

					//If image => change userStorage
					if (response.data.newImage) {
						let user = {
							id : userStorage.id,
							roleId : userStorage.roleId,
							sex: userStorage.sex,
							img: response.data.newImage,
							token : userStorage.token
						}

						let userItems = JSON.stringify(user)
						sessionStorage.setItem('userToken', userItems)
                    }

					window.location.reload();
				})
				.catch(error => {
					alert(`Quelque chose c'est mal passé.${error}`)
				})
			}else {
				alert("Les modifications ne sont pas valides")
			}
		},
		putPassWordEdit(context){
			let user_id = context.state.user_id_pointed
			//Compare Passwords
			if (context.state.param.newpasswordone === context.state.param.newpasswordtwo) {

				//Init data
				let password = context.state.param.newpasswordone
				let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

				let PWchange = {
					oldpassword : context.state.param.oldpassword,
					newpassword : password
				}

				//Send info to Back
				axios.put(`http://localhost:3000/api/param/password/${user_id}`, PWchange, {
					headers:{
						'Content-Type': 'application/json',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(() => {
					window.location.reload();
				})
				.catch(error => {
					alert(`Quelque chose c'est mal passé.${error}`)
				})
			}
			else {
				alert("Les mots de passe ne sont pas identiques")
			}
		},
		deleteUserDelete(context){
			//Init Data
			let user_id = context.state.user_id_pointed
			let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

			//Send info to Back
			axios.delete(`http://localhost:3000/api/param/${user_id}`,{
				headers:{
					'Authorization' : `Token ${userStorage.token}`
				}
			})
			.then(() => {
				//if the deleted user is the active user => signout
				if (user_id === userStorage.id) {
					sessionStorage.removeItem('userToken');
					window.location.href = 'http://localhost:8080/'
				}
				//if not, go to AllUser
				else{
					window.location.href = 'http://localhost:8080/User'
				}
			})
			.catch(error => {
				alert(`Quelque chose c'est mal passé.${error}`)
			})
		},
	},
	modules: {
	}
})