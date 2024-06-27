import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Router from "./pages/router";
import LoginScreen from "./pages/Login";
import { useSelector } from "react-redux";
import { loginSelector } from "./assets/features/loginSlice";

function App() {
  const { userInfo } = useSelector(loginSelector);

  return (
    <div className="App">
      <Routes>
        {/* Public routes accessible to all users */}
        <Route exact path="/" element={<LoginScreen />} />
        {/* Private routes accessible only to authenticated users */}
        {userInfo && (
          <Route
            path="/*"
            element={
              <Layout>
                <Router />
              </Layout>
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
