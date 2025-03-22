import { memo } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";


const LoginPage = () => {
    const navigate = useNavigate();
    // Xử lý submit form đăng nhập

    const hanldSubmit = (e) => {
        e.preventDefault();
        // Chuyển qua trang đặt hàng
        navigate (ROUTERS.ADMIN.ORDERS);
    }
    
    return (
        <div className="login">
            <div className="login_container">
                <div className="login_title">
                    <h2>Đăng nhập</h2>
                </div>
                <form className="login_form" onSubmit={hanldSubmit}>
                    <div className="login_form_group">
                        <label htmlFor="username" class = "login_label">
                            Tên đăng nhập
                        </label>
                        <input type="text" id="username" name="username" required placeholder="Tên đăng nhập"/>
                    </div>
                    <div className="login_form_group">
                        <label htmlFor="password" class = "login_label">
                            Mật khẩu
                        </label>
                        <input type="text" id="password" name="password" required placeholder="Mật khẩu"/>
                    </div>
                    <button type="submit" className="login_button">Đăng nhập ngay</button>
                </form>
                <div className="login_text">
                    <p>Chưa có tài khoản? <Link to="#">Đăng ký ngay</Link></p>
                </div>
            </div>
        </div>

    );
};

export default memo(LoginPage);
