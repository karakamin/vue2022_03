import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.28/vue.esm-browser.min.js";

const app = createApp({
    data() {
        return {
            url: "https://vue3-course-api.hexschool.io/v2",
            path: "karakamin-hex",
            products:[],
            oneProduct:[],
        }
    },
    methods:{
        checkUser(){
            axios.post(`${this.url}/api/user/check`)
            .then((res) => {
                if(res.data.success) {
                    this.getProdList();
                } else {
                    alert("無管理權限");
                    window.location = "index.html";
                }
               
            }).catch((err) => {
                alert("權限異常");
                window.location = "index.html";
            })
        },
        getProdList() {
            // 在 success 為 true 時，取得的資料放入 products
            axios.get(`${this.url}/api/${this.path}/admin/products`)
            .then((res) => {
                if(res.data.success) {
                    this.products = res.data.products;
                } else {
                    alert(res.data.success);
                }
                
            }).catch((err) =>{
                alert("產品清單取得異常");
            })
        },
        showDetails(item){
            // 顯示單一產品資料
            this.oneProduct = item; 
        }
    },
    created() {
        //存放token 只需要設定一次
        const tmpToken = document.cookie.replace(
            /(?:(?:^|.*;\s*)loginToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        // console.log(tmpToken);
        //axios預設headers
        axios.defaults.headers.common["Authorization"] = tmpToken;

        this.checkUser()
    },
})

app.mount("#app");
