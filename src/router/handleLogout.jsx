import { useEffect } from "react"
import { useSignOut } from "react-auth-kit"
import AuthService from "../service/authen"

function Logout() {
    const signOut = useSignOut()

    async function logOut() {
        const res = await AuthService.signOut(user.id)
        // console.log(res)
        signOut()
        // console.log('--')
    }

    // useEffect(() => {
    //     logOut()
    //     signOut()
    //     localStorage.removeItem('refresh_token')
    // }, [])

    // useEffect(() => {
    //     if (!localStorage.getItem('refresh_token')) navigate('/')
    // }, [localStorage])

    return <>
        {/* <button onClick={() => {
            window.location.pathname = "https://ourlogintest.lotuss.com/oidc/2/auth?scope=openid%20groups%20profile%20params&client_id=b138c660-e01e-013b-7b0d-06ed7b6b9151187457&state=62bdacb4-9fc4-4462-95af-a3974a16c0ab&nonce=b29a6d96-616d-4a66-b083-1da764c0c2e4&response_type=code&redirect_uri=https://smartenergy-dev.truedigital.com/api/v1/auth/oidc"
        }}
        >
            test
        </button> */}
    </>
}

export default Logout