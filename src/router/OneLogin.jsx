import lotusLogo from '../../src/img/lotusLogo.png'
import imgUser from '../../src/img/user.png'

const OneLogin = () => {

  const urlDev =
    'https://ourlogintest.lotuss.com/oidc/2/auth?scope=openid%20groups%20profile%20params&client_id=b138c660-e01e-013b-7b0d-06ed7b6b9151187457&state=62bdacb4-9fc4-4462-95af-a3974a16c0ab&nonce=b29a6d96-616d-4a66-b083-1da764c0c2e4&response_type=code&redirect_uri=https://smartenergy-dev.truedigital.com/api/v1/auth/oidc'
  const urlProd =
    'https://ourlogin.lotuss.com/oidc/2/auth?scope=openid%20groups%20profile%20params&client_id=87e8a670-03c0-013c-4008-264de85d4458189300&response_type=code&redirect_uri=https://smartenergy.truedigital.com/api/v1/auth/oidc'

  return (
    <>
      <div className="flex justify-center items-center bg-index-bg bg-cover w-screen h-screen ">
        <div className="px-5 min-w-[300px] bg-white flex flex-col justify-start items-center rounded-[20px] shadow-basic ">
          <div className="w-[150px] mt-5">
            <img className="object-contain" src={lotusLogo} alt="Lotus's" />
          </div>

          <div className="flex items-end justify-center w-full m-2">
            <img src={imgUser} className="" />
          </div>
          <b className="">Smart Energy</b>
          <p className=" text-sm mb-2">OneLogin Authentication</p>
          <button
            className="font-bold bg-primary rounded-[10px] text-white py-2.5 my-2.5 w-full transition-all duration-1000 text-medium disabled:bg-gray-400 mb-5"
            onClick={() => {
              // window.location.href = urlDev
              window.location.href = urlProd
            }}
          >
            OneLogin
          </button>
        </div>
      </div>
    </>
  )
}

export default OneLogin
