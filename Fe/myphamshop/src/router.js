import React from "react";
import {ADMIN_PATH, ROUTERS} from "./utils/router"
import HomePage from "./pages/User/homePage";
import ProductPage from "./pages/User/ProductsPage";
import { Routes, Route, useLocation} from "react-router-dom";
import MasterLayout from "./pages/User/theme/masterlayout"
import ProductDetails from "pages/User/ProductDetails";
import ShoppingCart from "pages/User/ShoppingCart";
import CheckoutPage from "pages/User/checkoutPage";
import LoginPage from "pages/admin/LoginPage";
import MasterAdminLayout from "pages/admin/theme/masterAdminLayout";
import OrderPage from "pages/admin/OrderPage";
import UserPage from "pages/admin/UserPage";
import CategoryPage from "pages/admin/CategoryPage";

const renderUserRouter = () => {
    const userRouter = [
        {
            path: ROUTERS.USER.HOME,
            Component: <HomePage/>
        },
        {
            path: ROUTERS.USER.PRODUCT,
            Component: <ProductPage/>
        },
        {
            path: ROUTERS.USER.PRODUCTS,
            Component: <ProductDetails/>
        },
        {
            path: ROUTERS.USER.SHOPPING_CART,
            Component: <ShoppingCart/>
        },
        {
            path: ROUTERS.USER.CHECKOUT,
            Component: <CheckoutPage/>
        }
    ]
    
    return (
        <MasterLayout>
            <Routes>
                {
                    userRouter.map((item, key) => (
                        <Route key={key} path={item.path} element ={item.Component} />
                    ))
                }
            </Routes>
        </MasterLayout>
    )
}

const renderAdminRouter = () => {
    const adminRouters = [
        {
            path: ROUTERS.ADMIN.LOGIN,
            Component: <LoginPage/>
        },
        {
            path: ROUTERS.ADMIN.USERAD,
            Component: <UserPage/>
        },
        {
            path: ROUTERS.ADMIN.CATEGORIES,
            Component: <CategoryPage/>
        },
        {
            path: ROUTERS.ADMIN.ORDERS,
            Component: <OrderPage/>
        },
    ]
    return (
        <MasterAdminLayout>
            <Routes>
                {
                    adminRouters.map((item, key) => (
                        <Route key={key} path={item.path} element ={item.Component} />
                    ))
                }
            </Routes>
        </MasterAdminLayout>
    )
}

const RouterCustom = () => {
    const location = useLocation();
    const isAdminRouters = location.pathname.startsWith(ADMIN_PATH);
    return isAdminRouters? renderAdminRouter() : renderUserRouter();
    
};

export default RouterCustom;