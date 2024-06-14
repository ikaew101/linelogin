import Spinner from "../components/spinner"
import { useEffect } from "react"
import AuthService from "../service/authen"
import Swal from "sweetalert2"
import { useSignIn } from "react-auth-kit"
import { useNavigate } from "react-router-dom"

function GoAuth() {
  let params = new URLSearchParams(window.location.search);
  const username = params.get('username')
  const status = params.get('status');

  const signIn = useSignIn()
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      if (status == '401') {
        Swal.fire({
          text: 'ไม่มีสิทธิ์ในการใช้งาน',
          icon: 'warning',
          confirmButtonColor: '#809DED',
          confirmButtonText: 'OK',
          iconColor: '#FFBC29',
          showCloseButton: true,
          didClose: () => {
            window.location.href = '/'
          }
        });
      }
      try {
        if (status) return
        const result = await AuthService.goGetUserInfo({ username: username })
        
        localStorage.setItem('_auth', result.data.accessToken)
        signIn({
          token: result.data.accessToken,
          expiresIn: 20,
          tokenType: 'Bearer',
          authState: [{
            'email': result.data.email,
            'firstName': result.data.firstName,
            'lastName': result.data.lastName,
            'availableStore': result.data.availableStore,
            id: result.data.userId,
            menus: result.data.menus,
            groups: result.data.groups,
          }]
        });

        if (localStorage.getItem("_auth")) {
          localStorage.setItem('refresh_token', result.data.refreshToken)
          window.location.reload()
        }
      } catch (error) {
        console.log('err', error)
        // navigate('/');
      }
    }

    getUserInfo()
  }, [])

  return (
    <div className="flex justify-center h-screen items-center">
      {username && <Spinner size="lg" />}
    </div>
  )
}

export default GoAuth
