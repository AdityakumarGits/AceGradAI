import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#030712] text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/candidatelogin"
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;