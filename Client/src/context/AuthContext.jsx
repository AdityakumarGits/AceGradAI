import { useEffect, useState,createContext } from "react";
 const AuthContext = createContext();
export const AuthProvider = ({children}) => {
 const [user,setUser]=useState(null);
 const [loading,setLoading]=useState();

 useEffect(()=>{
  const checkAuth = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
  checkAuth();
  }, []);


  // 3. Global Login Function
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 4. Global Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    setUser(null);
  };
  return (
    <div>
       <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
    </div>
  )
}

export default AuthContext;
