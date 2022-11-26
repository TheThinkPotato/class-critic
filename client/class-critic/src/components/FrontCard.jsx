import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScoreChart from "./ScoreChart";
import Star from "./Star";

let guid = 0;

const FrontCard = (props) => {
  const data = props.data;
  const totalRating = data.overallRatings ? data.overallRatings.totalRating : 0;

  guid++;

  const navigate = useNavigate();
  const navigateStudent = () => {
    navigate(`/Student`, { state: { data: data } });
  };

  useEffect(() => {
    //render
  }, []);

  useEffect(() => {
    //rerender
  }, [data]);

  return (
    <article>
      <div className="flex border-4 border-solid border-gray-400 my-2 p-5 max-w-xlg rounded-md bg-slate-50 text-black max-w-5xl mx-auto">
        {data.gender === "Male" && (
          <img
            src="/man.png"
            className="w-16 cursor-pointer"
            alt="student profile"
            onClick={() => {
              navigateStudent();
            }}
          />
        )}
        {data.gender === "Female" && (
          <img
            src="/lady.png"
            className="w-16 cursor-pointer"
            alt="student profile"
            onClick={() => {
              navigateStudent();
            }}
          />
        )}
        {data.gender === "Other" && (
          <img
            src="/user.png"
            className="w-16 cursor-pointer"
            alt="student profile"
            onClick={() => {
              navigateStudent();
            }}
          />
        )}

        <div className="grow flex-col">
          <table className="ml-10">
            <tbody>
              <tr>
                <td className="font-bold">Name:</td>
                <td className="pl-5">
                  {data.fName} {data.lName}
                </td>
              </tr>
              <tr>
                <td className="font-bold">College:</td>
                <td className="pl-5">{data.uni}</td>
              </tr>
              <tr>
                <td className="font-bold">Major:</td>
                <td className="pl-5">{data.major}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="hidden lg:block m-auto">
          <Star score={totalRating.toFixed(1)} guid={guid} />
        </div>
        <button
          className="self-center bg-blue-500 hover:bg-blue-700 text-white font-bold ml-10 p-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            navigateStudent();
          }}
        >
          See Details
        </button>
        <div
          className="cursor-pointer"
          onClick={() => {
            navigateStudent();
          }}
        >
          <ScoreChart score={totalRating.toFixed(3)} guid={guid} />
        </div>
      </div>
    </article>
  );
};

export default FrontCard;
