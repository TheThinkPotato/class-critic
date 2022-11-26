import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../data/apiCalls";
import { swearCheckOk } from "../functions/inputCleanup";
import Loader from "../components/Loader";

// const login = (email, password) => {};

// const register = (email, password) => {};

const UserContol = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  function handleLogin() {
    login(email, password).then((resp) => {
      if (resp.error) {
        setMessage(resp.message);
      } else {
        navigate("/");
      }
    });
  }

  let registerError = false;
  let logInError = false;
  let loading = false;

  useEffect(() => {
    //rerender
  }, [message]);

  return (
    <div className="flex flex-col text-xl border-4 border-solid border-gray-400 my-auto py-5 w-2/3 lg:w-1/3 w rounded-md bg-slate-50 text-black mx-auto">
      {!!loading && (
      <Loader />)}
      <h1 className="font-bold text-center mb-2 text-2xl">{props.title}</h1>

      <p className="font-medium text-center mb-2">{props.text}</p>

      {!!message && (
        <div className="bg-red-600 text-white text-center mx-2 py-1 px-2 rounded-lg max-w-sm self-center">
          {`${message}.`}
        </div>
      )}

      <div className="mb-4 mt-4 w-2/3 self-center">
        {props.type === "register" && (
          <div>
            <div className="mb-4 mt-4 w-full self-center">
              <h2 className="text-left font-semibold">First Name:</h2>
              <input
                className="bg-gray-200 border-2 border-black rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                placeholder="First Name"
                type={"text"}
                name="fName"
                value={fName}
                onChange={(e) => setfName(e.target.value)}
              />
            </div>
            <div className="mb-4 mt-4 w-full self-center">
              <h2 className="text-left font-semibold">Last Name:</h2>
              <input
                className="bg-gray-200 border-2 border-black rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                placeholder="Last Name"
                type={"text"}
                name="lName"
                value={lName}
                onChange={(e) => setlName(e.target.value)}
              />
            </div>
          </div>
        )}

        <h2 className="text-left font-semibold">Email:</h2>
        <input
          className="bg-gray-200 border-2 border-black rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          placeholder="Email"
          type={"text"}
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
      </div>

      <div className="mb-0 w-2/3 self-center">
        <h2 className="text-left font-semibold">Password:</h2>
        <input
          className="bg-gray-200 border-2 border-black rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          placeholder="Password"
          type={"password"}
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
      </div>

      {props.type === "login" && (
        <div className="mt-8 flex flex-col">
          <button
            className="w-2/6 self-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              handleLogin();
            }}
          >
            Log In
          </button>
        </div>
      )}

      {props.type === "register" && (
        <div className="mt-8 flex flex-col">
          <button
            className="w-2/6 self-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              loading = true;
              if (swearCheckOk(fName) && swearCheckOk(lName)) {
                register(fName, lName, email, password).then((res) => {
                  if (res.error) {
                    registerError = true;
                    setMessage(res.message);
                  } else {
                    registerError = false;
                    setMessage("");
                    navigate("/login");
                  }
                });
              } else {
                registerError = true;
                setMessage("Please don't use profanity in your name");
              }
            }}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default UserContol;
