import React from "react";
import Header from "../components/Header";
import DropDown from "../components/DropDown";
import { getUnis, addStudent } from "../data/apiCalls";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { capitalizer, inputCheckOk, swearCheckOk } from "../functions/inputCleanup";
import Loader from "../components/Loader";

export default function AddStudent() {
  const [loading, setLoading] = useState(false);

  const genderOptions = ["Male", "Female", "Other"];

  const [uniOptions, setUniOptions] = useState(["Select a College"]);
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [gender, setGender] = useState("Male");
  const [uni, setUni] = useState("");
  const [major, setMajor] = useState("");

  const navigate = useNavigate();

  const [error, setError] = useState("false");

  useEffect(() => {
    getUnis().then((resp) => {
      resp = resp.data.map((uni) => uni.name);
      setUniOptions(resp);
    });
  }, []);

  return (
    <div className="bg-indigo-900 text-white h-screen flex flex-col">
      <Header />
      <div className="flex flex-col text-xl border-4 border-solid border-gray-400 my-auto py-5 w-2/3 lg:w-1/2 w rounded-md bg-slate-50 text-black mx-auto">
        {!!loading && <Loader />}
        <div className="mx-5">
          <h1 className="font-bold text-center mb-10 text-2xl">Add Student</h1>
          <div className="mb-4 mt-4 w-full md:w-3/4 m-auto">
            <h2 className="text-left font-semibold">First Name:</h2>
            <input
              className="bg-gray-200 border-2 border-black rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              placeholder="First Name"
              type={"text"}
              name="fName"
              value={fName}
              onChange={(e) =>                 
                setfName(capitalizer(e.target.value))
              }
            />
          </div>
          <div className="mb-4 mt-4 w-full md:w-3/4 m-auto">
            <h2 className="text-left font-semibold">Last Name:</h2>
            <input
              className="bg-gray-200 border-2 border-black rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              placeholder="Last Name"
              type={"text"}
              name="lName"
              value={lName}
              onChange={(e) => setlName(capitalizer(e.target.value))}
            />
          </div>
          <div className="mb-4 mt-4 w-full md:w-3/4 m-auto">
            <h2 className="text-left font-semibold">Gender:</h2>
            <div className="w-1/3">
              <DropDown
                list={genderOptions}
                value={gender}
                setValue={setGender}
                name={"genderSelect"}
              />
            </div>
          </div>
          <div className="mb-4 mt-10 w-full md:w-3/4 m-auto">
            <h2 className="text-left font-semibold">College:</h2>

            <DropDown
              list={uniOptions}
              value={uni}
              setValue={setUni}
              name={"uniSelect"}
            />
          </div>
          <div className="mb-4 mt-4 w-full md:w-3/4 m-auto">
            <h2 className="text-left font-semibold">Major:</h2>
            <input
              className="bg-gray-200 border-2 border-black rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              placeholder="Major"
              type={"text"}
              name="major"
              value={major}
              onChange={(e) => setMajor(capitalizer(e.target.value))}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          {error !== "false" && (
            <div className="bg-red-600 text-white text-center p-2 mb-10 w-80 rounded mx-auto">
              <h2 className="font-bold">Error:</h2>
              <p className="font-semibold">{error}</p>
            </div>
          )}
          <div className="flex flex-row justify-center">
            <button
              className="mx-3 w-2/6 self-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                navigate("/");
              }}
            >
              Back
            </button>
            <button
              className="mx-3 w-2/6 self-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                setLoading(true);
                if (
                  !(
                    fName === "" ||
                    lName === "" ||
                    gender === "" ||
                    uni === "" ||
                    major === "" ||
                    !inputCheckOk(fName) ||
                    !inputCheckOk(lName) ||
                    !inputCheckOk(major) ||
                    !swearCheckOk(fName) ||
                    !swearCheckOk(lName) ||
                    !swearCheckOk(major)
                  )
                ) {
                  addStudent(fName, lName, gender, uni, major).then((res) => {
                    if (res.error) {
                      setLoading(false);
                      // setMessage(res.message);
                    } else {
                      navigate("/");
                      // setMessage("");
                    }
                  });
                } else {
                  setLoading(false);
                  setError("Please check inputs and retry.");
                }
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
