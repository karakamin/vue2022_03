import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.28/vue.esm-browser.min.js";

const app = createApp({
    data() {
        return{
            url: "https://vue3-course-api.hexschool.io/v2",
            path: "karakamin-hex",
            user:{
                username : "",
                password : "",
            },
        }
    },
    methods: {
        login() {
            axios.post(`${this.url}/admin/signin`, this.user)
            .then((res) => {
                console.log(res);
                const { token, expired,message } = res.data;

                //寫入 cookie
                document.cookie = `loginToken=${token};expires=${new Date(expired)}; path=/`;
                alert(message);
                window.location = "products.html";
            }).catch((err) => {
                const { message } = err.data;
                alert(message);

            })            
        },
    },

});
app.mount("#app");