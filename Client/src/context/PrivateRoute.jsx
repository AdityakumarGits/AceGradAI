import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#030712] text-white">
                Loading...
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/candidatelogin" replace />;
};

export default PrivateRoute;