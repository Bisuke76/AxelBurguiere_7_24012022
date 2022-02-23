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
                post : "",
                editMode: 0,
            }
        },
        components: {
            SubmitButton
        },
        computed : {
            commentText:{
                // getter
                get: function () {
                    return this.$store.state.comment.text;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.comment.text = newValue;
                }
            },
            postText:{
                // getter
                get: function () {
                    return this.post.content;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.post.text = newValue;
                }
            }
        },
        methods : {
            ...mapActions(['postCommentCreate', 'putPostEdit', 'deletePostDelete']),
            changeToEditMode(){
                this.editMode = 1
            },
            changeToNormalMode(){
                this.editMode = 0
                this.$store.state.post.text = ""
                this.$store.state.post.img = ""
            },
            addImage(event) {
                this.$store.state.post.img = event.target.files[0]
            }
        },
        beforeCreate(){
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            if (userStorage === null) {
                window.location.href = 'http://localhost:8080';
            }
            this.$store.state.post.id = this.$route.params.id
            this.$store.state.comment.text = ""
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
            let post_id = this.$route.params.id
            //Get the post
            axios.get(`http://localhost:3000/api/post/${post_id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
                .then(post => {
                    let commentCount =  0
                    this.post = post.data
                    this.post.date = moment(this.post.date).format('Do MMMM YYYY à HH:mm')
                    this.post.comments.forEach((comment) => {
                        comment.date = moment(comment.date).format('DD/MM/YY à HH:mm')
                        commentCount ++
                    })
                    this.post.commentsNum = commentCount
                })
                .catch(() => {
                    alert(`Ce post n'existe pas`)
                    window.location.href = 'http://localhost:8080/Activity';
                });
        },
        mounted(){
            document.title = `Répondre à un post`
        }
    }
</script>

<template>
    <main>
        <div v-if="editMode === 0" class="post">
            <!-- User info and Edit and Delete buttons -->
            <div class="user">

                <!-- User info -->
                <div class="user_info">
                    <router-link :to="{name: 'User', params: { id: post.user.id }}" class="user_img">
                        <img v-if="post.user.image" :src="post.user.image" title="Tableau de bord" >
                        <img v-else-if="post.user.sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                        <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
                    </router-link>
                    <div>
                        <h2>{{post.user.username}}</h2>
                        <p>{{post.date}}</p>
                    </div>
                </div>

                <!-- Edit and Delete buttons -->
                <div class="edit_post">
                    <i v-if="post.user.id === user_id" @click="changeToEditMode" class="fas fa-edit" title="Modifier"></i>
                    <i v-if="post.user.id === user_id" class="fas fa-trash" title="Supprimer" @click="deletePostDelete"></i>
                    <i v-else-if="role === 2" class="fas fa-trash" title="Supprimer" @click="deletePostDelete"></i>
                </div>
            </div>

            <!-- Content -->
            <p class="content">{{post.content}}</p>
            <img v-if="post.image" :src="post.image" class="post_img" alt="aucune description disponible">

            <div class="add_comment">
                <p><i class="fas fa-comments" title="Commenter"></i>{{ post.commentsNum }}</p>
            </div>

            <!-- Comments -->
            <div class="comments">

                <!-- Base Comments -->
                <div class="comment" v-for="comment in post.comments" :key="comment.id">

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

                    <!-- Comment edit -->
                    <router-link :to="{name: 'Comment', params: { id: comment.id },}">
                        <i class="fas fa-user-edit" title="Modifier ou supprimer" v-if="comment.user.id === user_id"></i>
                        <i class="fas fa-trash" title="Supprimer" v-else-if="role === 2"></i>
                    </router-link>
                </div>

                <!-- Comment Form -->
                <form class="form_comment">
                    <!-- User info and text -->
                    <div class="text">
                        <router-link :to="{name: 'User', params: { id: user_id }}" class="user_img">
                            <img v-if="img" :src="img" title="Tableau de bord">
                            <img v-else-if="sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                            <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
                        </router-link>

                        <textarea name="post" placeholder="Écrivez quelque chose ici ..." rows="1" v-model="commentText"></textarea>
                    </div>

                    <!-- Button -->
                    <SubmitButton class="btn-custom" @click="postCommentCreate" value="Publier"/>
                </form>
            </div>
        </div>

        <!-- Form -->
        <form class="post" v-else-if="editMode === 1">

            <!-- User Image and text -->
            <div class="text">
                <router-link :to="{name: 'User', params: { id: user_id }}" class="user_img">
                    <img v-if="img" :src="img" title="Tableau de bord">
                    <img v-else-if="sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                    <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
                </router-link>
                <textarea name="post" rows="1" v-model="postText"></textarea>
            </div>

            <!-- Image unplaod and buttons -->
            <div class="picture">
                <div>
                    <label for="myfile"><i class="fas fa-photo-video"></i> Photo / Vidéo</label>
                    <br>
                    <input @change="addImage" type="file" id="myfile" name="myfile" accept= "image/*">
                </div>

                <SubmitButton class="btn-custom" @click="changeToNormalMode" value="Annuler"/>
                <SubmitButton class="btn-custom" @click="putPostEdit" value="Modifier"/>
            </div>
        </form>
    </main>
</template>

<style scoped lang="scss">
main{
    margin-bottom: 3%;
}
.post{
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
/*Post*/
    .post_img{
        margin: auto;
        margin-top: 1%;
        width: 100%;
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
    .edit_post{
        width: 10%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .fa-user-edit, .fa-edit, .fa-trash{
        font-size: 1.8em;
        color: #d1515a;
        &:hover{
            color: #ffd7d7;
        }
    }
    .content{
        padding: 5% 0;
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
                width: 60%;
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
        .form_comment .text{
            display: flex;
            flex-direction: column;
            textarea{
                margin: 0;
                margin-top: 10px;
                width: auto;
                font-size: 1.1em;
                padding: 5%;
                height: 40px;
            }
        }
/*Form*/
    .text, .picture{
        display: flex;
    }
    .picture{
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 10px;
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
@media screen and (min-width:1024px){
    .post{
        margin : 0 20%;
    }
    /*Post*/
        .post_img{
            margin-top: 2%;
            width: 60%;
        }
        .edit_post{
            width: 8%;
            flex-direction: row;
        }
        .content{
            padding: 2% 0;
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
            .form_comment .text{
                flex-direction: row;
                textarea{
                    margin: 0;
                    margin-left: 10px;
                    width: 70%;
                    padding: 2%;
                }
            }
    /*Form*/
        .picture{
            width: 70%;
            label{
                font-size: 1.5em;
            }
            i{
                font-size: 40px;
            }
        }
        textarea{
            width: 90%;
        }
        .btn-custom{
            width: 200px;
        }
}
</style>