import { memo, useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { AiOutlineHome } from "react-icons/ai";
import axios from "axios"; // Import axios

const RegisterPage = () => {
    const navigate = useNavigate();
    const [error] = useState(""); // Thêm state để lưu lỗi
    const [user, setUser] = useState({
        username: "",
        password: "",
        typeUser: "",
});

const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value });
}

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("https://localhost:7200/api/User/Create", user);
        alert("Bạn đã đăng ký tài khoản thành công!");
        navigate(ROUTERS.ADMIN.LOGIN); // Chuyển về danh sách User
    } catch (error) {
        console.error("Lỗi khi tạo user:", error);
    }
};
    // Quay về Home
    const goToHome = () => {
        navigate(ROUTERS.USER.HOMEPAGE);
    };

    

    return (
        <div className="login">
            <div className="login_container">
                <div className="login_title">
                    <AiOutlineHome className="login_home-icon" onClick={goToHome} />
                    <h2>Đăng ký ngay</h2>
                </div>
                {/* Hiển thị thông báo lỗi nếu có */}
                {error && <div className="error-message">{error}</div>}
                <form className="login_form" onSubmit={handleSubmit}>
                    <div className="login_form_group">
                        <label htmlFor="role" className="login_label">
                            Loại người dùng
                        </label>
                        <select
                            id="role"
                            name="typeUser"
                            className="login_select"
                            value={user.typeUser}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn loại --</option>
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="login_form_group">
                        <label htmlFor="username" className="login_label">
                            Họ và Tên
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            required
                            placeholder="Tên đăng nhập"
                        />
                    </div>
                    <div className="login_form_group">
                        <label htmlFor="password" className="login_label">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                            placeholder="Mật khẩu"
                        />
                    </div>
                    <button type="submit" className="login_button">Đăng ký ngay</button>
                </form>
                <div className="login_text">
                    <p>Bạn đã có tài khoản? <Link to={ROUTERS.ADMIN.LOGIN}>Đăng nhập ngay</Link></p>
                </div>
            </div>
        </div>
    );
};

export default memo(RegisterPage);
