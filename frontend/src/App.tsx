import React from "react";
import logo from "./logo.svg";
import "./App.css";
import LoginButton from "./components/buttons/LoginButton";
import LogoutButton from "./components/buttons/LogoutButton";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user } = useAuth0();
  console.log(user);
  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <LoginButton></LoginButton>
          <LogoutButton />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>Footer here</footer>
      </div>
    </>
  );
}

export default App;
