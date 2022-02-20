import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.28/vue.esm-browser.min.js";

let apiUrl = "https://vue3-course-api.hexschool.io/v2";
let apiPath = "karakamin-hex";
let productModal = {};
let delProductModal = {};

const app = createApp({
    data() {
        return {
            products:[],
            tmpProduct:{
                imagesUrl:[],
            },
            //  isNew 用來判斷是資料新增還是修改
            isNew: false,
        }
    },
    methods:{
        checkUser(){
            let url = `${apiUrl}/api/user/check`;
            axios.post(url)
            // axios.post(`${this.url}/api/user/check`)

            .then((res) => {
                const { success, message } = res.data;
                if(success) {
                    this.getProdList();
                } else {
                    alert(message);
                    window.location = "index.html";
                }
               
            }).catch((err) => {
                alert("權限異常");
                window.location = "index.html";
            })
        },
        getProdList() {
            // 在 success 為 true 時，取得的資料放入 products
            let url = `${apiUrl}/api/${apiPath}/admin/products`;
            axios.get(url)
            .then((res) => {
                // console.log(res);
                const { success, message } = res.data;
                if(success) {
                    this.products = res.data.products;
                } else {
                    alert(message);
                }
                
            }).catch((err) =>{
                alert("產品清單取得異常");
            })
        },
        openModal(status, product) {
            // console.log(status, product);
            if (status === 'add') {
                this.tmpProduct = {
                    imagesUrl: [],
                }
                productModal.show();
                this.isNew = true;
            } else if (status === 'edit') {
                // 淺拷貝寫法
                // this.tmpProduct = { ...product };

                // 深拷貝寫法
                this.tmpProduct = JSON.parse(JSON.stringify(product));
                productModal.show();
                this.isNew = false;
            } else if (status === 'delete') {
                this.tmpProduct = { ...product };
                delProductModal.show();
            }
        },
        // 新增與修改產品
        updateProduct() {
            let url =`${apiUrl}/api/${apiPath}/admin/product`;
            let method ='post';
            
            if(!this.isNew){
                url = `${apiUrl}/api/${apiPath}/admin/product/${this.tmpProduct.id}`;
                method = 'put';
            }
            axios[method](url, { data: this.tmpProduct })
            .then((res) => {
                const { success, message } = res.data;
                if(success) {
                    alert(message);
                    //  新增完成後重新取得產品列表
                    this.getProdList();
                    // 關閉 modal 視窗
                    productModal.hide(); 
                } else {
                    alert(message);
                    productModal.hide();
                }
            }).catch((err) =>{
                console.log(err);
                alert("產品資料新增失敗");
                productModal.hide();
            })
        },
        // 刪除
        deleteProduct() {
            let url =`${apiUrl}/api/${apiPath}/admin/product/${this.tmpProduct.id}`;
            
            axios.delete(url)
            .then((res) => {
                const { success, message } = res.data;
                if(success) {
                    alert(message);
                    // 刪除完成後重新取得產品列表
                    this.getProdList();
                    // 關閉 modal 視窗
                    delProductModal.hide(); 
                } else {
                    alert(message);
                    delProductModal.hide(); 
                }
            }).catch((err) =>{
                console.log(err);
                alert("執行刪除失敗");
                delProductModal.hide(); 
            })
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
    mounted() {
        // 新增修改的 modal 視窗
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            // 不能使用鍵盤操作
            keyboard: false,
            backdrop: false
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            // 不能使用鍵盤操作
            keyboard: false,
            backdrop: false
        });

        
    }
})

app.mount("#app");
