export const ADMIN_PATH = "/quan-tri"
export const ROUTERS = {
    USER: {
        HOME:"",
        PROFILE:"thong_tin_ca_nhan",
        ABOUT:"/ve-chung-toi",
        PRODUCT:"/san-pham",
        PRODUCTS: "/san-pham/chi-tiet/:id",
        SHOPPING_CART: "/gio-hang",
        CHECKOUT: "/thanh-toan",
        BLOG:"/blog",
        LIENHE:"/lien-he",
    },
    ADMIN: {
        LOGIN:`${ADMIN_PATH}/dang-nhap`,
        USERAD:`${ADMIN_PATH}/user`,
        CATEGORIES:`${ADMIN_PATH}/danh-muc`,
        PRODUCTAD:`${ADMIN_PATH}/san-pham`,
        CUSTOMES:`${ADMIN_PATH}/khach-hang`,
        ORDERS:`${ADMIN_PATH}/don-hang`,
        
    }
}