<script>
    const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
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
                posts : "",
            }
        },
        components: {
            SubmitButton
        },
        computed : {
            postText:{
                // getter
                get: function () {
                    return this.$store.state.post.text;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.post.text = newValue;
                }
            },
        },
        methods : {
            ...mapActions(['postPostCreate']),
            addImage(event) {
                this.$store.state.post.img = event.target.files[0]
            }
        },
        beforeCreate(){
            //If user connected
            if (userStorage === null) {
                window.location.href = 'http://localhost:8080';
            }
        },
        beforeMount(){
            //Init
            const axios = require('axios')
            const moment = require('moment');
            moment().format();
            moment.locale('fr');
            //Fill in the data
            this.sex = userStorage.sex
            this.role = userStorage.roleId
            this.user_id = userStorage.id
            this.img = userStorage.img
            axios.get('http://localhost:3000/api/post', {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
            .then(posts => {
                this.posts = posts.data
                this.posts.forEach((post) => {
                    let commentsCount = 0
                    post.date = moment(post.date).format('Do MMMM YYYY à HH:mm')
                    post.comments.forEach((comment) => {
                        comment.date = moment(comment.date).format('DD/MM/YY à HH:mm')
                        commentsCount ++
                    })
                    post.commentsNum = commentsCount
                })
            })
            .catch(error => {
                alert(`Quelque chose c'est mal passé. Essayez à nouveau ${error}`)
            });
        },
        mounted(){
            document.title = 'Activité'
        }
    }
</script>

<template>
    <main>
        <!-- Form -->
        <form>
            <!-- User Image and text -->
            <div class="text">
                <router-link :to="{name: 'User', params: { id: user_id }}" class="user_img">
                    <img v-if="img" :src="img" title="Tableau de bord">
                    <img v-else-if="sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                    <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
                </router-link>
                <textarea name="post" placeholder="Écrivez quelque chose ici ..." v-model="postText"></textarea>
            </div>

            <!-- Image unplaod and button -->
            <div class="picture">
                <div>
                    <label for="myfile"><i class="fas fa-photo-video"></i> Photo / Vidéo</label>
                    <br>
                    <input @change="addImage" type="file" id="myfile" name="myfile" accept= "image/*">
                </div>
                <SubmitButton class="btn-custom" @click="postPostCreate" value="Publier"/>
            </div>
        </form>

        <!-- All posts -->
        <div>
            <div class="post" v-for="item in posts" :key="item.id">

                <!-- User info and edit button -->
                <div class="user">

                    <!-- User info -->
                    <div class="user_info">
                        <router-link :to="{name: 'User', params: { id: item.user.id }}" class="user_img">
                            <img v-if="item.user.image" :src="item.user.image" title="Tableau de bord">
                            <img v-else-if="item.user.sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                            <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
                        </router-link>

                        <div>
                            <h2>{{item.user.username}}</h2>
                            <p>{{item.date}}</p>
                        </div>
                    </div>

                    <!-- Edit Button -->
                    <router-link :to="{name: 'Post', params: { id: item.id },}">
                        <i v-if="item.user.id === user_id" class="fas fa-user-edit" title="Modifier ou supprimer"></i>
                        <i v-else-if="role === 2" class="fas fa-user-edit" title="Modifier ou supprimer"></i>
                    </router-link>
                </div>

                <!-- Content -->
                <p class="content">{{item.content}}</p>
                <img v-if="item.image" :src="item.image" class="post_img" alt="aucune description disponible">

                <router-link :to="{name: 'Post', params: { id: item.id },}" class="add_comment"><p>
                    <i class="fas fa-comments" title="Commenter"></i>
                    {{ item.commentsNum }}
                </p></router-link>

                <!-- Comments -->
                <div v-if="item.comments != ''" class="comments">

                    <!-- Base Comments -->
                    <div class="comment" v-for="comment in item.comments" :key="comment.id">

                        <!-- User info -->
                        <div class="user_comment">
                            <router-link :to="{name: 'User', params: { id: comment.user.id }}" class="user_img">
                                <img v-if="comment.user.image" :src="comment.user.image" title="Tableau de bord">
                                <img v-else-if="comment.user.sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                                <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
                            </router-link>
                            <div>
                                <h2>{{comment.user.username}}</h2>
                                <p>{{comment.date}}</p>
                            </div>
                        </div>

                        <!-- Comment content -->
                        <p>{{ comment.content }}</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped lang="css">
main{
    margin-bottom: 3%;
}
form, .post{
    background-color: #122542;
    padding: 10px 20px;
    border-radius: 30px;
    margin : 0 4%;
    display: flex;
    flex-direction: column;
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
    .text, .picture{
        display: flex;
    }
    .picture{
        flex-wrap: wrap;
        justify-content: space-between;
        label{
            display: flex;
            align-items: center;
            font-size: 1.1em;
            color: #fd2d01;
        }
        i{
            margin-right: 10px;
            color: #d1515a;
            font-size: 30px;
        }
    }
    textarea{
        color: #ffd7d7;
        background-color: rgba(2, 7, 13, 0.5);
        border: 2px #fd2d01 solid;
        border-radius: 40px;
        padding: 10px 10px 5px 10px;
        margin-left: 10px;
        width: 70%;
        font-size: 1.2em;
        font-family: Arial;
    }
    .btn-custom{
        width: 150px;
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
/*Post*/
    .post{
        margin-top: 40px;
        &_img{
            margin: auto;
            margin-top: 2%;
            width: 100%;
        }
    }
    h2{
        color: #fd2d01;
        font-weight: 100;
    }
    .user{
        display: flex;
        justify-content: space-between;
        &_info{
            display: flex;
            align-items: center;
            width: 80%;
            padding-bottom: 10px;
            border-bottom: 3px #d1515a solid;
            div{
                padding-left: 10px;
            }
            p{
                color: #ffd7d7;
                padding-top: 5%; 
            }
        }
    }
    .fa-user-edit{
        font-size: 1.8em;
        color: #d1515a;
        &:hover{
            color: #ffd7d7;
        }
    }
    .content{
        padding: 2% 0;
        color: white;
        font-size: 1.1em;
        line-height: 1.5em;
        letter-spacing: 0.02em;
        border-bottom: 2px rgba(255, 255, 255, 0.1) solid;
    }
    .add_comment{
        padding: 0 0 10px 10px;
        margin-top: 2%;
        p{
            font-size: 1.7em;
            color: #fd2d01;
            display: flex;
            align-items: center;
        }
        .fas{
            color: #d1515a;
            font-size: 1.5em;
            padding-right: 10px;
            &:hover{
                color: #ffd7d7;
            }
        }
    }
    /*Comments*/
        .comments{
            border: 4px #d1515a solid;
            border-radius: 10px;
            margin-top: 10px;
            padding: 3% 2%;
            p{
                font-size: 1.05em;
            }
        }
        .comment{
            display: flex;
            align-items: center;
            padding-bottom: 2%;
            margin-bottom: 7%;
            border-bottom: 2px #ffd7d7 solid;
            p{
                color: white;
                margin: 0 4%;
                width: 80%;
                word-wrap: break-word;   
            }
        }
        .user_comment{
            display: flex;
            div{
                margin-left: 10px;
                width: min-content;
                display: none;
            }
            p{
                color: #ffd7d7;
                font-size: 0.9em;
                padding-top: 5%;
                margin: 0;
            }
            .user_img{
                width: 40px;
                height: 40px;
                img{
                    width: 80px;
                }
            }
        }
@media screen and (min-width:1024px){
    form, .post{
        margin-right: 20%;
        margin-left: 20%;
    }
    .user_img{
        width: 60px;
        height: 60px;
        img{
            width: 100px;
            height: auto;
        }
    }
    /*Form*/
        textarea{
            padding: 20px 15px;
            font-size: 1.5em;
            height: 30px;
        }
        .picture label{
            font-size: 1.5em;
            i{
                font-size: 40px;
            }   
        }
        .btn-custom{
            width: 230px;
            height: 50px;
            font-size: 1.5em;
        }
    /*Post*/
        .post_img{
            margin-top: 1%;
            width: 60%;
        }
        .user_info{
            width: 60%;
        }
        /*Comments*/
            .comments{
                padding: 1% 2%;
            }
            .comment{
                padding-bottom: 1%;
                margin-bottom: 3%;
                p{
                    width: 80%;
                }
            }
            .user_comment div{
                display: block;
            }
}
</style>