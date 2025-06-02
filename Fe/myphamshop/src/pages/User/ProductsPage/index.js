import { memo, useEffect, useState } from "react";
import "./style.scss";
import Breadcrumb from "../theme/breadcrumb";
import { generatePath, Link } from "react-router-dom";
import { ROUTERS } from "utils/router";




import axios from "axios";
import { formatter } from "utils/fomatter";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";

const ProductPage = () => {
    const sorts = [
        "Giá cao đến thấp",
        "Giá thấp đến cao",
        "Mới đến cũ",
        "Cũ đến mới",
        "Bán chạy",
        "Đang giảm giá",
    ];

    
    const [products, setProducts] = useState([]);


    useEffect(() => {
        axios.get("https://localhost:7007/api/Product") // sửa lại đúng API URL
          .then((response) => {
            setProducts(response.data);
          })
          .catch((error) => {
            console.error("Lỗi khi lấy sản phẩm phổ biến:", error);
          });
      }, []);

    return (
        <>
            <Breadcrumb name="Danh sách sản phẩm"/>
            <div className="container">
                <div className="row">
                    {/* Cột bên trái */}
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
                            
                        </div>
                    </div>
                    {/* Cột bên phải */}
                    <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="row">
                            {products.map((item, index) => (
                            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12" key={index}>
                                <div className="featured_item pl-pr-10">
                                    <div
                                        className="featured_item_img"
                                        style={{
                                            backgroundImage: `url(https://localhost:7007/images/${item.image})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        {/* Overlay khi hết hàng */}
                                        {item.inventory === 0 && (
                                            <div className="out-of-stock-overlay">
                                                <span className="title">Hết hàng</span>
                                            </div>
                                        )}
                                        <ul className="featured_item_img_hover">
                                            <li>
                                                <AiOutlineEye />
                                            </li>
                                            <li>
                                                <Link to={generatePath(ROUTERS.USER.PRODUCTS, { productId: item.productId })} >
                                                    <AiOutlineShoppingCart />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="featured_item_text">
                                        <h6>
                                            <Link to={generatePath(ROUTERS.USER.PRODUCTS, { productId: item.productId })} >
                                                {item.name}
                                            </Link>
                                        </h6>
                                        <h5>{formatter(item.price)}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>

                <div className="product_footer">
                    <div className="product_pagination">
                        <div className="product_page-number">
                            <button type="button" className="product_page-btn">→</button>
                            <button type="button" className="product_page-btn product_page-btn--active">1</button>
                            <button type="button" className="product_page-btn">2</button>
                            <button type="button" className="product_page-btn">3</button>
                            <button type="button" className="product_page-btn">...</button>
                            <button type="button" className="product_page-btn">←</button>
                        </div>
                    </div>
                </div>
            </div>

            
        </>
    );
}

export default memo(ProductPage);
