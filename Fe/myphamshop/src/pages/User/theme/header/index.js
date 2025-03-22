import { memo, useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineFacebook, 
         AiOutlineInstagram, 
         AiFillGoogleCircle, 
         AiFillTwitterCircle, 
         AiOutlineUser, 
         AiOutlineMail,
         AiOutlineShoppingCart,
         AiOutlineMenu,
         AiOutlinePhone,
         AiOutlineDownCircle,
         AiOutlineUpCircle} from "react-icons/ai";

import { MdEmail } from "react-icons/md";

import "./style.scss"
import { ROUTERS } from "utils/router";
import { formatter } from "utils/fomatter";

export const categories = [
        "Sữa rửa mặt",
        "Kem dưỡng"
    ];


const Header = () => {
    const navigate = useNavigate(); 
    const location = useLocation();
    // const[isShowCategories, setisShowCategories] = useState([false]);
    const[isShowHamberger, setisShowHamberger] = useState([false]);
    const[isHome, setIsHome] = useState([location.pathname.length <= 1]);
    const[isShowCategories, setisShowCategories] = useState(isHome);
    const[menus, setMenus] = useState([
        {
            name:"Trang chủ",
            path: ROUTERS.USER.HOME,
        },
        {
            name:"Về chúng tôi",
            path: ROUTERS.USER.ABOUT
        },
        {
            name:"Sản phẩm",
            path: ROUTERS.USER.PRODUCT,
            isShowSubmenu: false,
            child: [
                {
                    name:"Sữa rửa mặt",
                    path: "",
                },
                {
                    name:"Kem dưỡng ẩm",
                    path: "",
                },
            ],
        },
        {
            name:"Blog",
            path: ROUTERS.USER.BLOG
        },
        {
            name:"Liên hệ",
            path: ROUTERS.USER.LIENHE
        }
    ])

    

    useEffect(() => {
        const isHome = location.pathname.length <= 1;
        setIsHome(isHome);
        setisShowCategories(isHome);
    }, [location]
    );

    return (
        <>
            <div className={`hamberger_menu_overlay ${
                isShowHamberger ? "active" : ""
            }`}
            onClick={() => setisShowHamberger(false)}
            />
            <div className={`hamberger_menu_wrapper ${isShowHamberger ? "show" : ""}`}
            >
                <div className="header_logo">
                    <h2>Bae Beauty</h2>
                </div>
                <div className="hamberger_menu_cart">
                    <ul>
                        <li>
                            <Link to="#">
                                <AiOutlineShoppingCart /> <span>1</span>
                            </Link>
                        </li>
                    </ul>
                    <div className="header_cart_price">
                        Giỏ hàng: <span>{formatter(1000000)}</span>
                    </div>
                </div>
                <div className="hamberger_menu_widget">
                    <div className="header_top_right_auth">
                        <Link to="#">
                            <AiOutlineUser  /> <span>Đăng nhập</span>
                        </Link>

                    </div>
                </div>
                <div className="hamberger_menu_nav">
                    <ul>
                        {
                            menus.map((menu, menuKey) => (
                                <li key = {menuKey} to={menu.path}>
                                    <Link
                                        to={menu.path}
                                        onClick={() => {
                                            const newMenus = [...menus];
                                            newMenus[menuKey].isShowSubmenu =
                                                !newMenus[menuKey].isShowSubmenu;
                                            setMenus(newMenus);
                                        }}
                                    >
                                        {menu.name}
                                        {menu.child && (
                                            menu.isShowSubmenu ? (
                                                <AiOutlineDownCircle />
                                            ) 
                                            : <AiOutlineUpCircle />
                                        )}
                                        {menu.child && (
                                            <ul className={`header_menu_dropdown ${
                                                menu.isShowSubmenu ? "show_submenu" : "" 
                                            }`}>
                                                 {menu.child.map((childItem, childKey) => (
                                                    <li key={`${menuKey} - ${childKey}`}>
                                                        <Link to={childItem.path}>
                                                            {childItem.name}
                                                        </Link>
                                                        
                                                    </li>
                                                 ))}
                                                
                                            </ul>
                                        )}
                                    </Link>
                                </li>
                            ))
                        }
                        
                    </ul>
                </div>
                <div className="header_top_right_social">
                    <Link to={""}>
                        <AiOutlineFacebook /> 
                    </Link>
                    <Link to={""}>
                        <AiOutlineInstagram />
                    </Link>
                    <Link to={""}>
                        <AiFillGoogleCircle /> 
                    </Link>
                    <Link to={""}>
                        <AiFillTwitterCircle />
                    </Link>
                </div>
                <div className="hamberger_menu_context">
                    <ul>
                        <li>
                        <MdEmail />Thanhh@gmail.com
                        </li>
                        <li>
                            Miễn phí đơn từ {formatter(200000)}
                        </li>
                    </ul>
                </div>
            </div>
            

            {/* Tạo một thanh Header */}
            <div className="header_top">
                <div className="container">
                    <div className="row">
                        <div className="col-6 header_top_left">
                            <ul>
                                <li>
                                    <AiOutlineMail />
                                    <span>
                                        Thanhh@gmail.com
                                    </span>
                                </li>
                                <li>
                                    Miễn phí ship hàng đơn từ 1.000.000đ
                                </li>
                            </ul>

                        </div>
                        <div className="col-6 header_top_right">
                            <ul>
                                <li>
                                    <Link to={""}>
                                        <AiOutlineFacebook /> 
                                    </Link>
                                </li>
                                <li>
                                    <Link to={""}>
                                        <AiOutlineInstagram />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={""}>
                                        <AiFillGoogleCircle /> 
                                    </Link>
                                </li>
                                <li>
                                    <Link to={""}>
                                        <AiFillTwitterCircle />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={""}>
                                        <AiOutlineUser />
                                    </Link>
                                    <span onClick={() => navigate(ROUTERS.ADMIN.LOGIN)}>Đăng nhập</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* Tạo một logo và thanh menu */}
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="header_logo">
                            <h1>BaeBeauty</h1>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="header_menu">
                            <ul>
                            {menus.map((menu, menuKey) => (
                                <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                                    <Link to={menu.path}>{menu.name}</Link>
                                    {menu.child && (
                                        <ul className="header_menu_dropdown">
                                            {menu.child.map((childItem, childKey) => (
                                                <li key={`${menuKey} - ${childKey}`}>
                                                    <Link to={childItem.path}>{childItem.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="header_cart">
                            <div className="header_cart_price">
                                    <span>{formatter(1000000)}</span>
                                </div>
                            <ul>
                                <li>
                                    <Link to={ROUTERS.USER.SHOPPING_CART}>
                                        <AiOutlineShoppingCart />
                                        <span>5</span>
                                        </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="banner_open">
                            <AiOutlineMenu 
                                onClick={() => setisShowHamberger(true)}
                                />
                        </div>
                    </div>
                </div>
            </div>
            {/* Tạo danh mục sản phẩm và banner*/}
            <div className="container">
                <div className="row here_categories_container">
                    <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 here_categories">
                            <div className="here_categories_all" 
                            onClick={() => setisShowCategories(!isShowCategories)}>
                                <AiOutlineMenu />
                                Danh sách sản phẩm
                            </div>
                            {isShowCategories && (
                                <ul className={isShowCategories ? "" : "hidden"}>
                                    {
                                        categories.map((categories, key) => (
                                            <li key = {key}>
                                                <Link to= {ROUTERS.USER.PRODUCT}>{categories}</Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )}
                            
                    </div>
                    <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 here_search_container">
                        <div className="here_search">
                            <div className="here_search_form">
                                <form>
                                    <input type="text" name="" value= "" placeholder="Bạn đang tìm gì?" />
                                    <button type="submit" className="site-btn">Tìm kiếm</button>
                                </form>
                            </div>
                            <div className="here_search_phone">
                                <div className="here_search_phone_icon">
                                    <AiOutlinePhone />
                                </div>
                                <div className="here_search_phone_text">
                                    <p>+84 12345678</p>
                                    <span>Hỗ trợ 24/7</span>
                                </div>
                            </div>
                        </div>
                        { /*Thực hiện ẩn banner khi chuyển sang trang Danh sách sản phẩm*/}
                        {isHome && (
                            <div className="here_items">
                                <div className="here_items_text">
                                    <span>Lan tỏa vẻ đẹp mới</span>
                                    <h2>Làn da mới</h2>
                                    <p>Miễn phí giao hàng toàn quốc</p>
                                    <Link to="" className="primary-btn">
                                        Mua ngay
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(Header);
