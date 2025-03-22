import { memo } from "react";
import "./style.scss";
import Breadcrumb from "../theme/breadcrumb";

import product1Img from "assets/User/images/product/son_1.jpg";
import product2Img from "assets/User/images/product/son_2.jpg";
import product3Img from "assets/User/images/product/son_3.jpg";
import { AiOutlineCopy, AiOutlineEye, AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import { formatter } from "utils/fomatter";
import { ProductCard } from "component";
import { featproducts } from "utils/common";
import Quantity from "component/Quantity";


const ProductDetails = () => {

const imgs = [product1Img, product2Img, product3Img]

    return (
        <>
            <Breadcrumb name="Chi tiết sản phẩm"/>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_details_pic">
                        <img src={product1Img} alt="product-pic" />
                        <div className="main">
                            {
                                imgs.map((item, key) => (
                                    <img src={item} alt="product-pic" key = {key}/>
                                ))
                            }
                        </div>
                    </div>
                    <div className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_details_text">
                        <h2>Son Background</h2>
                        <div className="seen_icon">
                            <AiOutlineEye />
                            {` 10 (lượt đã xem)`}
                        </div>
                        <h3>{formatter(2000000)}</h3>
                        <p>
                            Son môi Background là dòng son được yêu thích nhờ vào chất son mềm mịn, lên màu chuẩn và độ bám cao, giúp tôn lên vẻ đẹp tự nhiên của đôi môi. 
                        </p>
                        <Quantity />
                        <ul>
                            <li>
                                <b>Tình trạng: </b> <span>Còn hàng </span>
                            </li>
                            <li>
                                <b>Số lượng: </b> <span>20 </span>
                            </li>
                            <li>
                                <b>Chia sẻ: </b> {" "}
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
                                <p>Màu son lên môi chuẩn từng centimet.</p>
                            </li>
                            <li>
                                <p>Độ bám dính cao, kháng nước vượt trội. Màu sắc giữ trên môi đến 8 tiếng. Sau khi ăn uống chỉ trôi tầm 20% nếu đánh toàn bộ môi, và trôi khoảng 30% nếu đánh trong lòng môi.</p>
                            </li>
                            <li>
                                <p>Che phủ vết vân môi và vùng da bong tróc do khô. Bạn gần như không thể thấy được các khuyết điểm trên môi.</p>
                            </li>
                            <li>
                                <p>Chất son kem Hàn Quốc đặc trưng: mịn mướt không gây vón cục.</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="section_title">
                    <h2>Sản phẩm tương tự</h2>
                </div>
                <div className="row">
                    {featproducts.all.products.map((item, key) =>
                        <div key = {key} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                            <ProductCard img = {item.img} name={item.name} price={item.price}/>
                        </div>
                    )}
                    
                </div>
            </div>
        </>
    );
}

export default memo(ProductDetails);
