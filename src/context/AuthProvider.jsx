import { createContext, useState } from "react";
import { useEffect } from "react";
import AuthService from "../service/authen";
import Cookies from "universal-cookie"
import jwtDecode from "jwt-decode"

const AuthContext = createContext({});
const cookies = new Cookies()

export const AuthenProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState({});

  useEffect(() => {
    const checkTimeout = async () => {
      try {
        const expireTime = localStorage.getItem('_auth_storage')
        const userId = JSON.parse(localStorage.getItem('_auth_state'))[0]?.id
        if (new Date(expireTime) < new Date()) {
            const res = await AuthService.signOut(userId)
            localStorage.removeItem('refresh_token')

            var Cookies = document.cookie.split(';');
            Cookies?.map((ele) => {
                if (!ele.split('=')[0]) return
                cookies.remove(ele.split('=')[0])
            })
            localStorage.removeItem('_auth')
            window.location.href = res || ''
        } else {
            const refreshToken = localStorage.getItem('refresh_token')
            const res = await AuthService.refreshToken({ refreshToken: refreshToken })
            const time = new Date(jwtDecode(res.accessToken).exp * 1000).toISOString()
            localStorage.setItem('refresh_token', res.refreshToken)
            localStorage.setItem('_auth_storage', time)
            localStorage.setItem('_auth', res.accessToken)
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkTimeout();
  }, []);

  const logout = () => {
    removeAccessToken();
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,  auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
