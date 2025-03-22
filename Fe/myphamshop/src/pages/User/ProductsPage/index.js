import { memo } from "react";
import "./style.scss";
import Breadcrumb from "../theme/breadcrumb";
import { Link } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { categories } from "../theme/header";


import product1Img from "assets/User/images/product/son_1.jpg";
import product2Img from "assets/User/images/product/son_2.jpg";
import product3Img from "assets/User/images/product/son_3.jpg";
import product4Img from "assets/User/images/product/toner_1.jpg";
import product5Img from "assets/User/images/product/toner_2.jpg";
import product6Img from "assets/User/images/product/serum_1.jpg";
import product7Img from "assets/User/images/product/serum_2.jpg";
import product8Img from "assets/User/images/product/serum_3.jpg";
import product9Img from "assets/User/images/product/duong_am_1.jpg";
import product10Img from "assets/User/images/product/duong_am_2.jpg";
import product11Img from "assets/User/images/product/duong_am_3.jpg";
import { ProductCard } from "component";

const ProductPage = () => {
const sorts = [
    "Giá cao đến thấp",
    "Giá thấp đến cao",
    "Mới đến cũ",
    "Cũ đến mới",
    "Bán chạy",
    "Đang giảm giá",
];

const products = [
    {
        img : product1Img,
        name:"Son 1",
        price: "200000",
    },
    {
        img : product2Img,
        name:"Son 2",
        price: "200000",
    },
    {
        img : product3Img,
        name:"Son 3",
        price: "200000",
    },
    {
        img : product4Img,
        name:"Toner 1",
        price: "200000",
    },
    {
        img : product5Img,
        name:"Toner 2",
        price: "200000",
    },
    {
        img : product6Img,
        name:"Serum 1",
        price: "200000",
    },
    {
        img : product7Img,
        name:"Serum 2",
        price: "200000",
    },
    {
        img : product8Img,
        name:"Serum 3",
        price: "200000",
    },
    {
        img : product9Img,
        name:"Dưỡng ẩm 1",
        price: "200000",
    },
    {
        img : product10Img,
        name:"Dưỡng ẩm 2",
        price: "200000",
    },
    {
        img : product11Img,
        name:"Dưỡng ẩm 3",
        price: "200000",
    },
    
]

    return (
        <>
            <Breadcrumb name="Danh sách sản phẩm"/>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                        <div className="slidebar">
                            <div className="slidebar_item">
                                <h2>Tìm kiếm</h2>
                                <input type="text" />
                            </div>
                            <div className="slidebar_item">
                                <h2>Mức giá</h2>
                                <div className="price-range-wrap">
                                    <div>
                                        <p>Từ:</p>
                                        <input type="number" min={0} />
                                    </div>
                                    <div>
                                        <p>Đến:</p>
                                        <input type="number" min={0} />
                                    </div>
                                </div>
                            </div>
                            <div className="slidebar_item">
                                <h2>Sắp xếp</h2>
                                <div className="tags">
                                    {sorts.map((item, key) => (
                                        <div className={`tag ${key === 0 ? "active": ""}`} key = {key}> 
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="slidebar_item">
                                <h2>Thể loại khác</h2>
                                <ul>
                                    {categories.map((name, key) => (
                                        <li key ={key}>
                                            <Link to={ROUTERS.USER.PRODUCT}>{name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="row">
                            {
                                products.map((item, key) => (
                                    <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12" key = {key} >
                                        <ProductCard 
                                            name={item.name} 
                                            img ={item.img} 
                                            price = {item.price}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(ProductPage);
