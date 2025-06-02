import { memo, useEffect, useState } from "react";
import "./style.scss";
import Breadcrumb from "../theme/breadcrumb";
import { AiOutlineCopy, AiOutlineEye, AiOutlineFacebook, AiOutlineInstagram, AiOutlineShoppingCart } from "react-icons/ai";
import { formatter } from "utils/fomatter";
import Quantity from "component/Quantity";
import { generatePath, Link, useParams } from "react-router-dom";
import axios from "axios";
import { ROUTERS } from "utils/router";

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [productnoibat, setProductNoiBat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Sử dụng state để quản lý số lượng
    const [quantity, setQuantity] = useState(1); 

    // Lấy thông tin chi tiết sản phẩm
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const res = await axios.get(`https://localhost:7007/api/Product/${productId}`);
                setProduct(res.data);
            } catch (err) {
                setError("Không thể tải chi tiết sản phẩm!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [productId]);

    // Lấy sản phẩm nổi bật
    useEffect(() => {
        const fetchProductNoiBat = async () => {
            try {
                const response = await axios.get("https://localhost:7007/api/Product/san-pham-noi-bat");
                setProductNoiBat(response.data);
            } catch (err) {
                setError("Không thể tải sản phẩm!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductNoiBat();
    }, []);

    

    return (
        <>
            <Breadcrumb name="Chi tiết sản phẩm" />
            <div className="container">
                {loading && <p>Đang tải dữ liệu...</p>}
                {error && <p className="error-message">{error}</p>}
                {product && (
                    <>
                        <div className="row">
                            <div className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_details_pic">
                                <div className="product_details_picture position-relative">
                                    <img
                                        src={`https://localhost:7007/images/${product.image}`}
                                        alt="product-pic"
                                        style={{ borderRadius: "6px" }}
                                    />
                                    {product.inventory === 0 && (
                                        <div className="out-of-stock-overlay">
                                        <span className="title">Hết hàng</span>
                                        </div>
                                    )}
                                    </div>
                                <div className="main">
                                    <img src={`https://localhost:7007/images/${product.image1}`} alt="product-pic-0" />
                                    <img src={`https://localhost:7007/images/${product.image2}`} alt="product-pic-1" />
                                    <img src={`https://localhost:7007/images/${product.image3}`} alt="product-pic-2" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_details_text">
                                <h2>{product.name}</h2>
                                <div className="seen_icon">
                                    <AiOutlineEye />
                                    {`${product.viewCount} (lượt đã xem)`}
                                </div>
                                <h3>{formatter(product.price)}</h3>
                                <p>{product.description}</p>
                                <Quantity 
                                    product={product} 
                                    quantity={quantity}
                                    setQuantity={setQuantity} 
                                />
                                
                                <ul>
                                    <li>
                                        <b>Tình trạng: </b> <span>{product.trang_thai} </span>
                                    </li>
                                    <li>
                                        <b>Số lượng: </b> <span>{product.inventory}</span>
                                    </li>
                                    <li>
                                        <b>Chia sẻ: </b>{" "}
                                        <span>
                                            <AiOutlineFacebook />
                                            <AiOutlineInstagram />
                                            <AiOutlineCopy />
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="product_details_tab">
                            <h4>Thông tin chi tiết</h4>
                            <div>
                                <ul>
                                    <li>
                                        <p>{product.descriptionDetails}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )}
                <div className="section_title">
                    <h2>Sản phẩm tương tự</h2>
                </div>
                <div className="row">
                    {productnoibat.map((item, index) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={index}>
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
                                            <AiOutlineShoppingCart />
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
        </>
    );
}

export default memo(ProductDetails);
