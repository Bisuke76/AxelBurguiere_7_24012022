<script>
    export default {
        name: "Login",
        data(){
            return{
                user_id :"",
                role:"",
                user : "",
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
            //Init
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            const axios = require('axios')
            const moment = require('moment');
            moment().format();
            moment.locale('fr');
            //Fill in the data
            this.role = userStorage.roleId
            this.user_id = userStorage.id
            let creator_id = this.$route.params.id
            axios.get(`http://localhost:3000/api/post/user/${creator_id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
            .then(user_posts => {
                this.user = user_posts.data
                this.user.posts.forEach((post) => {
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
            document.title = 'Tableau de bord'
        }
    }
</script>

<template>
    <main>
        <!-- User info -->
        <aside>

            <div class="user_img">
                <img v-if="user.image" :src="user.image" title="Tableau de bord">
                <img v-else-if="user.sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
            </div>

            <!-- All info -->
            <div class="block">
                <h2>{{ user.username }}</h2>

                <p v-if="user.roleId === 2" class="role">Admin</p>
                <p v-else class="role">Employé</p>

                <p>{{ user.email }}</p>

                <i v-if="user.sex === 'F'" class="fas fa-venus"></i>
                <i v-else class="fas fa-mars"></i>
            </div>

            <!-- Biography -->
            <div>
                <h3>Biographie</h3>
                <p v-if="user.biography" class="block">{{ user.biography }}</p>
                <p v-else class="block">Aucune biographie</p>
            </div>
        </aside>

        <!-- All posts -->
        <div>
            <div class="post" v-for="item in user.posts" :key="item.id">

                <!-- User info and edit button -->
                <div class="user">

                    <!-- User info -->
                    <div class="user_info">
                        <div class="user_img">
                            <img v-if="user.image" :src="user.image" title="Tableau de bord">
                            <img v-else-if="user.sex === 'M'" src="../assets/user_male.svg" id="no_image_user" title="Tableau de bord">
                            <img v-else src="../assets/user_female.svg" id="no_image_user" title="Tableau de bord">
                        </div>

                        <div class="user_info_username">
                            <h2>{{user.username}}</h2>
                            <p>{{item.date}}</p>
                        </div>
                    </div>

                    <!-- Edit Button -->
                    <router-link :to="{name: 'Post', params: { id: item.id },}" v-if="user.id === user_id">
                        <i class="fas fa-user-edit" title="Modifier ou supprimer" v-if="user.id === user_id"></i>
                        <i class="fas fa-user-edit" title="Modifier ou supprimer" v-else-if="role === 2"></i>
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

<style scoped lang="scss">
main{
    margin-bottom: 3%;
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
/* User info  */
    aside{
        margin : 0 4%;
        div{
            width: 90%;
            margin-bottom: 20px;
        }
        i{
            font-size: 5em;
            color: #d1515a;
        }
        p{
            color: white;
        }
        .user_img{
            width: 100px;
            height: 100px;
            margin: auto;
            img{
                width: 160px;
            }
        }
    }
    .role{
        color: #d1515a;
        font-size: 1.6em;
    }
    .block{
        margin: 10px 0;
        background-color: #122542;
        border: 1.5px solid #d1515a;
        border-radius: 10px;
        padding: 2%;
        word-wrap: break-word;
    }
/*Post*/
    .post{
        background-color: #122542;
        padding: 10px 20px;
        border-radius: 30px;
        margin : 0 4%;
        display: flex;
        flex-direction: column;
        margin-top: 40px;
        &_img{
            margin: auto;
            margin-top: 2%;
            width: 100%;
        }
    }
    h2, h3{
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
            &_username{
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
        margin-right: 40%;
        margin-left: 10%;
    }
    .user_img{
        width: 60px;
        height: 60px;
        img{
            width: 100px;
            height: auto;
        }
    }
    /* User info  */
        aside{
            position: fixed;
            top:0;
            right: 0;
            margin : 0;
            padding: 7% 2%;
            height: 100%;
            background-color: #122542;
            max-width: 300px;
            min-width: 230px;
            div{
                width: 100%;
            }
            i{
                font-size: 3em;
            }
        }
        .block{
            border: 2px solid #d1515a;
            width: 95%;
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