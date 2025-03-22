import { memo } from "react";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";
import { formatter } from "utils/fomatter";
import { Quantity } from "component";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";




const ShoppingCart = () => {

    const navigate = useNavigate();


    return (
        <>
            <Breadcrumb name ="Giỏ hàng"/>
            <div className="container">
                <div className="table_cart">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="shopping_cart_item">
                                    <img
                                        src="https://picsum.photos/id/1015/25/25"
                                        alt="product-pic"
                                    />
                                    <h4>Sữa rửa mặt</h4>
                                </td>
                                <td>{formatter(250000)}</td>
                                <td>
                                    <Quantity quantity = "2" hasAddToCart = {false} />
                                </td>
                                <td>{formatter(450000)}</td>
                                <td className="icon_close">
                                    <AiOutlineClose />
                                </td>
                            </tr>
                            <tr>
                                <td className="shopping_cart_item">
                                    <img
                                        src="https://picsum.photos/id/1015/25/25"
                                        alt="product-pic"
                                    />
                                    <h4>Sữa rửa mặt</h4>
                                </td>
                                <td>{formatter(250000)}</td>
                                <td>
                                    <Quantity quantity = "2" hasAddToCart = {false} />
                                </td>
                                <td>{formatter(450000)}</td>
                                <td className="icon_close">
                                    <AiOutlineClose />
                                </td>
                            </tr>
                            <tr>
                                <td className="shopping_cart_item">
                                    <img
                                        src="https://picsum.photos/id/1015/25/25"
                                        alt="product-pic"
                                    />
                                    <h4>Sữa rửa mặt</h4>
                                </td>
                                <td>{formatter(250000)}</td>
                                <td>
                                    <Quantity quantity = "2" hasAddToCart = {false} />
                                </td>
                                <td>{formatter(450000)}</td>
                                <td className="icon_close">
                                    <AiOutlineClose />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="shopping_continue">
                            <h3>Mã giảm giá</h3>
                            <div className=" shopping_discount">
                                <input type="text" placeholder="Nhập mã giảm giá" />
                                <button type="submit" className="button-submit">Áp dụng</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="shopping_checkout">
                            <h2>Tổng đơn</h2>
                            <ul>
                                <li>Số lượng: <span>{2}</span></li>
                                <li>Thành tiền: <span>{formatter(450000)}</span></li>
                            </ul>
                            <button type="submit" className="button-submit" onClick={() => navigate(ROUTERS.USER.CHECKOUT)}>
                                Tiến hành đặt hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(ShoppingCart);
