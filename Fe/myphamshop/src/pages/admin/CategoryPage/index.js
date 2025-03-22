import { memo } from "react";
import "./style.scss";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";


const CategoryPage = () => {
    const category = [
        {id:1, name:"Sữa rửa mặt", decription:"Sữa rửa mặt"},
        {id:2, name:"Nước tẩy trang", decription:"Nước tẩy trang"},
        {id:3, name:"Toner", decription:"Toner"}
    ]
   
    
    return (
        <div className="container">
            <div className="orders">
                <h2>Quản lý danh mục sản phẩm</h2>
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
                                <th>Mã danh mục</th>
                                <th>Tên danh mục</th>
                                <th>Mô tả</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            category.map((item, i) =>(
                                <tr key={i}>
                                    <td>
                                        <span>{item.id}</span>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.decription}</td>
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

export default memo(CategoryPage);
