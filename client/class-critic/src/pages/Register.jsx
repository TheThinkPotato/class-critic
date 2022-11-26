import React from "react";
import Header from "../components/Header";
import UserControl from "../components/UserControl";

export default function Login() {
  return (
      <div className="bg-indigo-900 text-white h-screen flex flex-col">
        <Header />
        <UserControl
          title={"Register"}
          text={"Please enter email and password."}
          type={"register"}
        />
      </div>
  );
}
