import Footer from "pages/User/theme/footer";
import { memo } from "react";
import { useLocation } from "react-router-dom";
import { ROUTERS } from "utils/router";
import HeaderAdmin from "../headerAdmin";


const MasterAdminLayout = ({children, ...props}) => {
    const location = useLocation();
    const isLoginPage = location.pathname.startsWith(ROUTERS.ADMIN.LOGIN);
    
    return (
        <div {...props}>
            {!isLoginPage && <HeaderAdmin />}
            {children}
            {!isLoginPage && <Footer />}
        </div>
    );
};

export default memo(MasterAdminLayout);