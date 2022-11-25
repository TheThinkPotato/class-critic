import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import ScoreChart from "../components/ScoreChart";
import Star from "../components/Star";
import Rate from "../components/Rate";
import { useNavigate } from "react-router-dom";

export default function Student() {
  const [showRateWindow, setShowRateWindow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(location.state.data);

  useEffect(() => {
    //render
  }, [showRateWindow]);

  return (
      <div className="bg-indigo-900 text-white h-screen flex flex-col">
        <Header />
        <div className="text-xl border-4 border-solid border-gray-400 my-auto py-5 w-2/3 lg:w-3/4 w rounded-md bg-slate-50 text-black mx-auto max-w-5xl">
          <h1 className="font-bold text-center mb-10 text-2xl">
            Student Details
          </h1>
          <div className="flex flex-row">
            {data.gender === "Male" && (
              <img
                src="/man.png"
                className="w-1/4 ml-5 rounded-lg border-4 border-solid border-gray-400  bg-gradient-to-b from-white to-gray-200"
                alt="student profile"
              />
            )}
            {data.gender === "Female" && (
              <img
                src="/lady.png"
                className="w-1/4 ml-5 rounded-lg border-4 border-solid border-gray-400 bg-gradient-to-b from-white to-gray-200"
                alt="student profile"
              />
            )}
            {data.gender === "Other" && (
              <img
                src="/user.png"
                className="w-1/4 ml-5 rounded-lg border-4 border-solid border-gray-400 bg-gradient-to-b from-white to-gray-200"
                alt="student profile"
              />
            )}
            <div className="grow my-auto">              
              <div className="mx-auto w-5/6">
                <table className="">
                  <tbody>
                    <tr>
                      <td className="font-bold">Name:</td>
                      <td className="pl-24 xl:pl-36">
                        {data.fName} {data.lName}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">College:</td>
                      <td className="pl-24 xl:pl-36">{data.uni}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Major:</td>
                      <td className="pl-24 xl:pl-36">{data.major}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Gender:</td>
                      <td className="pl-24 xl:pl-36">{data.gender}</td>
                    </tr>
                    {data.overallRatings && (
                      <tr>
                        <td className="font-bold pt-5">Overall Score:</td>
                        <td className="pl-24 xl:pl-36 pt-5">
                          {data.overallRatings.totalRating.toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  </table>
                  {data.overallRatings && (
                    
                      <Star
                        width="45"
                        score={data.overallRatings.totalRating.toFixed(1)}
                      />
                    
                  )}
                </div>
              
            </div>
            <div className="mx-10 mt-10">
              {data.overallRatings && (
                <ScoreChart
                  score={data.overallRatings.totalRating.toFixed(3)}
                />
              )}

              {localStorage.getItem("email") && (
                <button
                  className="ml-6 mt-36 px-10 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded teamWork:outline-none teamWork:shadow-outline"
                  onClick={() => {
                    if (showRateWindow) {
                      setShowRateWindow(false);
                    } else {
                      setShowRateWindow(true);
                    }
                  }}
                >
                  Rate
                </button>
              )}
            </div>
          </div>
          {showRateWindow && (
            <Rate
              setShowRateWindow={setShowRateWindow}
              data={data}
              setData={setData}
            />
          )}
          {data.overallRatings && (
            <div className="flex flex-row mt-5">
              <div className="flex flex-col m-auto ">
                <div className="flex flex-row space-x-3">
                  <h2 className="font-bold mb-1">Communication:</h2>
                  <p>{data.overallRatings.communication.toFixed(2)}</p>
                </div>
                <Star score={data.overallRatings.communication.toFixed(1)} />
                <div className="flex flex-row space-x-3 mt-4">
                  <h2 className="font-bold mb-1">Participation:</h2>
                  <p>{data.overallRatings.participation.toFixed(2)}</p>
                </div>
                <Star score={data.overallRatings.participation.toFixed(1)} />
                <div className="flex flex-row space-x-3 mt-4">
                  <h2 className="font-bold mb-1">Quality Of Work:</h2>
                  <p>{data.overallRatings.qualityOfWork.toFixed(2)}</p>
                </div>
                <Star score={data.overallRatings.qualityOfWork.toFixed(1)} />
              </div>
              <div className="flex flex-col m-auto">
                <div className="flex flex-row space-x-3">
                  <h2 className="font-bold mb-1">TeamWork:</h2>
                  <p>{data.overallRatings.teamWork.toFixed(2)}</p>
                </div>
                <Star score={data.overallRatings.teamWork.toFixed(1)} />
                <div className="flex flex-row space-x-3 mt-4">
                  <h2 className="font-bold mb-1">Punctuality:</h2>
                  <p>{data.overallRatings.punctual.toFixed(2)}</p>
                </div>

                <Star score={data.overallRatings.punctual.toFixed(1)} />
                <div className="flex flex-row space-x-3 mt-4">
                  <h2 className="font-bold mb-1">Attitude:</h2>
                  <p>{data.overallRatings.attitude.toFixed(2)}</p>
                </div>

                <Star score={data.overallRatings.attitude.toFixed(1)} />
              </div>
            </div>
          )}
          <div className="flex flex-row w-80 mx-auto ">
            <button
              className="mt-5 mx-auto px-10 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded teamWork:outline-none teamWork:shadow-outline"
              onClick={() => {
                navigate("/");
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
  );
}
