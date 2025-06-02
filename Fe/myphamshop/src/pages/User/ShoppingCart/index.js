import { memo, useEffect, useState } from "react";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";
import { formatter } from "utils/fomatter";
import { Quantity } from "component";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import axios from "axios";




const ShoppingCart = () => {

    const navigate = useNavigate();
    const [cartDetails, setCartDetails] = useState(null); 
    const [discountCode, setDiscountCode] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    // Lấy thông tin giỏ hàng
    useEffect(() => {
        const fetchCartDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setCartDetails(null); // Không có token, đặt cartDetails là null
                return;
            }

            try {
                const response = await axios.get("https://localhost:7099/api/Cart/user-cartItem", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setCartDetails(response.data); // Giả sử response.data chứa thông tin giỏ hàng
                } else {
                    setCartDetails(null); // Nếu không lấy được giỏ hàng, đặt là null
                    console.warn("Không thể lấy thông tin giỏ hàng!");
                }
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng:", error);
                setCartDetails(null); // Xử lý lỗi và đặt cartDetails là null
            }
        };

        fetchCartDetails();
    }, []);
    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemoveFromCart = async (cartItemId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Không có token, yêu cầu đăng nhập.");
            alert('Vui lòng đăng nhập!');
            return;
        }
        console.log("Token tồn tại:", token);
    
        try {
            console.log(`Đang gửi yêu cầu xóa sản phẩm có ID: ${cartItemId}`);
            const response = await axios.delete(`https://localhost:7099/api/Cart/delete-item/${cartItemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Kiểm tra response.status và dữ liệu trả về
            if (response.status === 200) {
                console.log("API trả về thành công:", response.data);
    
                // Cập nhật giỏ hàng sau khi xóa
                const updatedCart = { ...cartDetails };
                updatedCart.items = updatedCart.items.filter(item => item.cartItemId !== cartItemId);
                updatedCart.totalCartPrice = response.data.newTotalCartPrice;
                updatedCart.quantity = response.data.newQuantity;
    
                console.log("Giỏ hàng sau khi xóa:", updatedCart);
                setCartDetails(updatedCart);
    
                alert("Sản phẩm đã được xóa khỏi giỏ hàng.");
            } else {
                console.error("API trả về status không phải 200:", response.status);
                alert("Không thể xóa sản phẩm. Vui lòng thử lại!");
            }
        } catch (error) {
            // In ra lỗi chi tiết khi không thể gửi yêu cầu
            if (error.response) {
                // Lỗi có phản hồi từ server
                console.error("Lỗi từ server:", error.response);
                alert(`Lỗi từ server: ${error.response?.data?.message || "Có lỗi xảy ra."}`);
            } else if (error.request) {
                // Lỗi khi gửi yêu cầu
                console.error("Không nhận được phản hồi từ server:", error.request);
                alert("Không nhận được phản hồi từ server. Vui lòng thử lại!");
            } else {
                // Lỗi khác
                console.error("Lỗi khác:", error.message);
                alert("Có lỗi xảy ra. Vui lòng thử lại!");
            }
        }
    };
    // Lấy thông tin giỏ hàng
    const fetchCartDetails = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await axios.get("https://localhost:7099/api/Cart/user-cartItem", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setCartDetails(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        }
    };
    // Áp mã giảm giá 
    const handleApplyDiscount = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập!");
            return;
        }

        if (!discountCode) {
            alert("Vui lòng nhập mã giảm giá!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "https://localhost:7099/api/Cart/apply-discount",
                { discountCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
            setMessage("Áp mã giảm giá thành công!");

            // Sau khi áp mã, gọi lại hàm lấy giỏ hàng để cập nhật thông tin
            await fetchCartDetails();
        } else if (response.status === 401) {
            // Giả sử mã lỗi 404 khi mã giảm giá không tồn tại
            setMessage("Mã giảm giá không tồn tại.");
        } else {
            setMessage("Không thể áp mã giảm giá.");
        }
        } catch (error) {
        console.error("Lỗi khi áp mã giảm giá:", error);
        
        // Kiểm tra nếu lỗi là do mã giảm giá không tồn tại
        if (error.response && error.response.status === 404) {
            setMessage("Mã giảm giá không tồn tại");
        } else if (error.response && error.response.status === 400) {
            // Nếu API trả về lỗi 400 (bad request), có thể mã giảm giá không hợp lệ
            setMessage("Mã giảm giá không hợp lệ, Vui lòng nhập mã khác!");
        } else {
            // Thông báo lỗi chung nếu có lỗi khác
            setMessage("Hệ thống không cho phép dùng nhiều mã giảm giá cho cùng 1 đơn hàng đâu! 😜");
        }
        } finally {
                setLoading(false);
            }
        };

    // Hủy mã giảm giá
    const handleRemoveDiscount = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.delete(
                "https://localhost:7099/api/Cart/remove-discount",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                await fetchCartDetails(); // Cập nhật lại giỏ hàng
                setDiscountCode("");
                setMessage("Mã giảm giá đã được hủy.");
            }
        } catch (error) {
            console.error("Lỗi khi hủy mã giảm giá:", error);
            setMessage("Lỗi khi hủy mã giảm giá.");
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật số lượng
    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập!");
            return;
        }

        try {
            const response = await axios.put(
            `https://localhost:7099/api/Cart/update-item-quantity/${cartItemId}`,
            { quantity: newQuantity },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (response.status === 200) {
            // Thay vì update thủ công, gọi lại API lấy giỏ hàng mới
            await fetchCartDetails();
            } else {
            alert("Cập nhật số lượng không thành công.");
            }
        } catch (error) {
            console.error("Lỗi cập nhật số lượng:", error);
            alert("Lỗi khi cập nhật số lượng. Thử lại sau nhé!");
        }
        };
    
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
                        {cartDetails && cartDetails.items && cartDetails.items.length > 0 ? (
                            cartDetails.items.map((product) => (
                                <tr key={product.productId}>
                                    <td className="shopping_cart_item">
                                        <img
                                            src={`https://localhost:7007/images/${product.productImage}`} // Lấy ảnh từ productImage
                                            alt="product-pic"
                                        />
                                        <h4>{product.productName}</h4> {/* Tên sản phẩm */}
                                    </td>
                                    <td>{formatter(product.price)}</td> {/* Giá sản phẩm */}
                                    <td>
                                    <Quantity 
                                        product={product} 
                                        initialQuantity={product.quantity} 
                                        hasAddToCart={false} 
                                        onQuantityChange={(newQty) => handleUpdateQuantity(product.cartItemId, newQty)} 
                                    />

                                    </td>
                                    <td>{formatter(product.totalCost)}</td> {/* Tổng tiền của sản phẩm */}
                                    <td className="icon_close" 
                                        onClick={() => handleRemoveFromCart(product.cartItemId)} // Sử dụng cartItemId cho việc xóa
                                    >
                                        <AiOutlineClose />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Giỏ hàng của bạn trống</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="shopping_continue">
                            <h3>Mã giảm giá</h3>
                            <div className="shopping_discount">
                                <input
                                    type="text"
                                    placeholder="Nhập mã giảm giá"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    disabled={!!cartDetails?.discountCode} // Disable input nếu đã áp dụng mã giảm giá
                                />
                                
                                <button 
                                    className="button-submit" 
                                    onClick={handleApplyDiscount} 
                                    disabled={loading || !!cartDetails?.discountCode} // Disable nếu đang tải hoặc đã áp mã
                                >
                                    {loading ? "Đang áp dụng..." : "Áp dụng"}
                                </button>

                                {/* Hiển thị nút "Huỷ mã" nếu có mã giảm giá */}
                                {cartDetails?.discount > 0 && (
                                    <>
                                        <button
                                            className="button-submit"
                                            style={{ marginLeft: "10px", backgroundColor: "#FF6347" }}
                                            onClick={handleRemoveDiscount}
                                            disabled={loading}
                                        >
                                            Huỷ mã
                                        </button>
                                    </>
                                )}
                            </div>
                            {message && <p className="discount-message">{message}</p>}
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="shopping_checkout">
                            <h2>Tổng đơn</h2>
                            <ul>
                                <li>Số lượng: <span>{cartDetails?.quantity ?? 0}</span></li>
                                <li>Tổng tiền: <span>{formatter(cartDetails?.originalTotal ?? 0)}</span></li>
                                <li>Mã giảm giá: <span>{cartDetails?.discountCode ?? "Không có"}</span></li>
                                <li>Tiết kiệm: <span>-{formatter(cartDetails?.discount ?? 0)}</span></li>
                                <li>Thành tiền: <span>{formatter(cartDetails?.totalCartPrice ?? 0)}</span></li>
                            </ul>
                            <button 
                                type="submit" 
                                className="button-submit" 
                                onClick={() => navigate(ROUTERS.USER.CHECKOUT)}
                                disabled={!cartDetails?.items || cartDetails.items.length === 0}
                            >
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
