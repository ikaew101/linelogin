import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "../pages";
import OneLogin from "./OneLogin";
import ForgotPassword from "../pages/forgotPassword";
import EnergyMonitoring from "../pages/energyMonitoring";
import LayoutAuthenticated from "../layout/Layout";
import RefrigerationPage from "../pages/refrigerationPage";
import AuthService from "../service/authen";
import { useSignIn, useSignOut } from "react-auth-kit";
import GoAuth from "./GoAuth";
import Logout from "./handleLogout";
import AirCondition from "../pages/airCondition";
import AirHistory from "../pages/airCondition/history";
import Lighting from "../pages/lighting";
import UserIndex from "../pages/management/user";
import { ViewUser } from "../components/User/viewUser";
import { EditUser } from "../components/User/editUser";
import { EditGroup } from "../components/User/editGroup";
import StoreIndex from "../pages/management/store";
import { AddEditStore } from "../components/Store/AddEditStore";
import { ViewStore } from "../components/Store/ViewStore";
import DeviceIndex from "../pages/management/device";
import RefrigConfigPage from "../pages/refrigConfig";
import LightingConfigPage from "../pages/lightingConfig";
import ChillerConfigPage from "../pages/chillerConfig";
import AirConfigPage from "../pages/aigConfig";

export default function Router() {
  const _auth_state = localStorage.getItem("_auth");

  const navigate = useNavigate();
  const signOut = useSignOut();

  async function checkLastActive() {
    const userId = JSON.parse(localStorage.getItem("_auth_state"))[0]?.id;
    await AuthService.refreshTokenPage(userId);
  }

  useEffect(() => {
    if (!_auth_state) {
      if (window.location.pathname == "/login") return;
      if (window.location.pathname == "/login/auth") return;
      return navigate("/");
    } else {
      // checkLastActive()
      if (!localStorage.getItem("refresh_token")) {
        signOut();
        // window.location.href = 'https://ourlogintest.lotuss.com/oidc/2/auth?scope=openid%20groups%20profile%20params&client_id=b138c660-e01e-013b-7b0d-06ed7b6b9151187457&state=62bdacb4-9fc4-4462-95af-a3974a16c0ab&nonce=b29a6d96-616d-4a66-b083-1da764c0c2e4&response_type=code&redirect_uri=https://smartenergy-dev.truedigital.com/api/v1/auth/oidc'
        // Prod
        window.location.href =
          "https://ourlogin.lotuss.com/oidc/2/auth?scope=openid%20groups%20profile%20params&client_id=87e8a670-03c0-013c-4008-264de85d4458189300&response_type=code&redirect_uri=https://smartenergy.truedigital.com/api/v1/auth/oidc";
      }
    }
  }, []);

  const signIn = useSignIn();

  async function refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    const res = await AuthService.refreshToken({ refreshToken: refreshToken });

    localStorage.setItem("refresh_token", res.refreshToken);
    signIn({
      token: res.accessToken,
      expiresIn: 60,
      tokenType: "Bearer",
    });
  }

  return (
    <>
      <Routes>
        {_auth_state ? (
          <Route element={<LayoutAuthenticated />}>
            <Route path="/energyMonitoring" element={<EnergyMonitoring />} />
            <Route path="/refrigeration" element={<RefrigerationPage />} />
            <Route path="/airCondition" element={<AirCondition />} />
            <Route path="/airCondition/history" element={<AirHistory />} />
            <Route path="/lighting" element={<Lighting />} />

            {/*  <Route path="/manage_user">
              <Route path="" element={<UserIndex />} />
              <Route path="view/:id" element={<ViewUser />} />
              <Route path="edit/:id" element={<EditUser />} />
              <Route path="group/:id" element={<EditGroup />} />
            </Route>
            <Route path="/manage_store">
              <Route path="" element={<StoreIndex />} />
              <Route path="add" element={<AddEditStore />} />
              <Route path="view/:id?" element={<ViewStore />} />
              <Route path="edit/:id?" element={<AddEditStore />} />
            </Route>
            <Route path="/manage_device">
              <Route path="" element={<DeviceIndex />} />
            </Route>
             <Route path="/refrig_config" >
              <Route path="" element={<RefrigConfigPage />} />
            </Route>
            <Route path="/lighting_config" >
              <Route path="" element={<LightingConfigPage />} />
            </Route>
            <Route path="/chiller_config" >
              <Route path="" element={<ChillerConfigPage />} />
            </Route>    
            <Route path="/air_config" >
              <Route path="" element={<AirConfigPage />} />
            </Route> */}

            <Route path="*" element={<Navigate to="/energyMonitoring" />} />
          </Route>
        ) : (
          <>
            <Route path="/" element={<OneLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />

            <Route path="/login/auth" element={<GoAuth />}>
              <Route path=":username" element={<></>} />
            </Route>

            <Route path="/logout" element={<Logout />} />
          </>
        )}
      </Routes>
    </>
  );
}
