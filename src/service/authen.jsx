import { Component } from "react"
import { http } from "./http.endpoint"
import jwtDecode from "jwt-decode"
import Cookies from "universal-cookie"
// import * as nJwt from "njwt"

const cookies = new Cookies()
// const Promise = require("promise")

export default class AuthService extends Component {
    static signIn(body) {
        localStorage.removeItem('_id')
        return http.post(`/login`, body)
    }

    static refreshToken(body) {
        return http.post(`/refreshToken`, body)
    }

    static refreshTokenTest() {
        return http.post(`/test`)
    }

    static goGetUserInfo(body) {
        localStorage.removeItem('_id')
        return http.post(`/auth/onelogin`, body)
    }

    static signOut(id) {
        return http.post(`/logout?userId=${id}`)
    }

    static refreshTokenPage = async (id) => {
        const expireTime = localStorage.getItem('_auth_storage')
        if (new Date(expireTime) < new Date()) {
            const res = await http.post(`/logout?userId=${id}`)
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
            // useSignIn({
            //     token: res.accessToken,
            //     expiresIn: 60,
            //     tokenType: 'Bearer',
            // });
        }
    }

}
