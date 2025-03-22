import { memo } from "react";
import "./style.scss";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";


const UserPage = () => {
    const users = [
        {id:1, name:"User 1", password:"123456", type:"Admin"},
        {id:2, name:"User 2", password:"654321", type:"User"},
        {id:3, name:"User 3", password:"111111", type:"User"}
    ]
   
    
    return (
        <div className="container">
            <div className="orders">
                <h2>Quản lý User</h2>
                {/* Nút tạo mới */}
                <div className="orders_header">
                    <button type="button" className="orders_header_button-create">
                        <AiOutlinePlus /> <span>Tạo mới</span>
                    </button>
                </div>

                <div className="orders_content">
                    <table className="orders_table">
                        <thead>
                            <tr>
                                <th>Mã người dùng</th>
                                <th>Tên người dùng</th>
                                <th>Mật khẩu</th>
                                <th>Loại người dùng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            users.map((item, i) =>(
                                <tr key={i}>
                                    <td>
                                        <span>{item.id}</span>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.password}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <div className="orders_button">
                                            <button type="button" className="orders_button-btn"><AiOutlineEdit /></button>
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

export default memo(UserPage);
