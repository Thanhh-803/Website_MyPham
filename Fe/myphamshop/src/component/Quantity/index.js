import { memo, useState, useEffect } from "react";
import "./style.scss";
import axios from "axios";

const Quantity = ({
  product,
  hasAddToCart = true,
  initialQuantity = 1,
  onQuantityChange, // thêm prop callback
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const isOutOfStock = product?.inventory <= 0;

  // gọi callback sau khi thay đổi số lượng
  const increaseQuantity = () => {
    setQuantity((prev) => {
      const newQty = prev + 1;
      onQuantityChange && onQuantityChange(newQty);
      return newQty;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => {
      const newQty = prev > 1 ? prev - 1 : 1;
      onQuantityChange && onQuantityChange(newQty);
      return newQty;
    });
  };

  const handleChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) value = 1;
    setQuantity(value);
    onQuantityChange && onQuantityChange(value);
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    const cartItem = {
      UserId: 1004,
      Items: [{ ProductId: product.productId, Quantity: quantity }],
    };

    try {
      const response = await axios.post(
        "https://localhost:7099/api/Cart/add-to-cart",
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert(`${quantity} sản phẩm đã được thêm vào giỏ hàng!`);
      } else {
        alert("Không thể thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      alert("Vui lòng đăng nhập!");
    }
  };

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  return (
    <div className="quantity_container">
      <div className="quantity">
        <span className="qtybtn" onClick={decreaseQuantity}>
          -
        </span>
        <input type="number" value={quantity} onChange={handleChange} min={1} />
        <span className="qtybtn" onClick={increaseQuantity}>
          +
        </span>
      </div>

      {hasAddToCart &&
        (!isOutOfStock ? (
          <button type="submit" onClick={handleAddToCart} className="button-submit">
            Thêm vào giỏ hàng
          </button>
        ) : (
          <button
            type="button"
            className="button-submit disabled"
            onClick={() => alert("Sản phẩm này đã hết hàng")}
            disabled
          >
            Hết hàng
          </button>
        ))}
    </div>
  );
};

export default memo(Quantity);
