import { memo, useEffect, useState } from "react";
import "./style.scss";
import { formatter } from "utils/fomatter";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { TbDetails } from "react-icons/tb";

const STATUS = {
    ORDERED:{
        KEY:"ORDERED",
        label:"Đã đặt",
        className:"orders_dropdown-item",
    },
    PRIPARING:{
        KEY:"PRIPARING",
        label:"Lên đơn",
        className:"orders_dropdown-item",
    },
    DEVIVERED:{
        KEY:"DEVIVERED",
        label:"Đã giao hàng",
        className:"orders_dropdown-item",
    },
    CANCELLED:{
        KEY:"CANCELLED",
        label:"Đã hủy đơn",
        className:"orders_dropdown-item orders_dropdown-item--danger",
    },
}
const OrderPage = () => {
    const orders = [
        {
            id: 1,
            order_code: "DH001",
            total_price: 100000,
            customer_name: "User 1",
            order_date: "2022-05-20",
            status: "Đang giao hàng",
        },
        {
            id: 2,
            order_code: "DH001",
            total_price: 100000,
            customer_name: "User 1",
            order_date: "2022-05-20",
            status: "Đang giao hàng",
        },
        {
            id: 3,
            order_code: "DH001",
            total_price: 100000,
            customer_name: "User 1",
            order_date: "2022-05-20",
            status: "Đang giao hàng",
        },
        {
            id: 4,
            order_code: "DH001",
            total_price: 100000,
            customer_name: "User 1",
            order_date: "2022-05-20",
            status: "Đang giao hàng",
        },
    ]
    // activeDropdown lưu trữ các giá trị mà chúng ta chọn trong trạng tháithái
    const [activeDropdown, setactiveDropdown] = useState(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isDropdown = event.target.closest("orders_dropdown");
            if (!isDropdown) {
                setactiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
    }, [])
    
    return (
        <div className="container">
            <div className="orders">
                <h2>Quản lý đơn hàng</h2>
                <div className="orders_content">
                    <table className="orders_table">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Tổng tiền</th>
                                <th>Người đặt hàng</th>
                                <th>Ngày đặt hàng</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            orders.map((item, i) =>(
                                <tr key={i}>
                                    <td>
                                        <span>{item.id}</span>
                                    </td>
                                    <td>{formatter(item.total_price)}</td>
                                    <td>{item.customer_name}</td>
                                    <td>{new Date(item.order_date).toLocaleDateString()}</td>
                                    <td>
                                        <div className="orders_dropdown">
                                            <button className="orders_action-button"
                                            onClick={() => setactiveDropdown(item.id)}
                                            >
                                                Đã đặt
                                                <span className="arrow">▿</span>
                                            </button>
                                            {
                                                activeDropdown === item.id && (
                                                    <div className="orders_dropdown-menu">
                                                        {
                                                            Object.values(STATUS).map((status) => (
                                                                <button 
                                                                    key={status.key} 
                                                                    className= {status.className}
                                                                    onClick={() => setactiveDropdown(null)}
                                                                >
                                                                    {status.label}
                                                                </button>
                                                            ))  
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </td>
                                    <td>
                                        <div className="orders_button">
                                            <button type="button" className="orders_button-btn"><AiOutlineEdit /></button>
                                            <button type="button" className="orders_button-btn"><TbDetails /></button>
                                            <button type="button" className="orders_button-btn"><AiOutlineDelete /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>

                <div className="orders_footer">
                    <div className="orders_pagination">
                        <div className="orders_page-number">
                            <button type="button" className="orders_page-btn">→</button>
                            <button type="button" className="orders_page-btn orders_page-btn--active">1</button>
                            <button type="button" className="orders_page-btn">2</button>
                            <button type="button" className="orders_page-btn">3</button>
                            <button type="button" className="orders_page-btn">...</button>
                            <button type="button" className="orders_page-btn">←</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(OrderPage);
