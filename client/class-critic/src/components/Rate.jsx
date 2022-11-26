import React, { useEffect, useState } from "react";
import { addRating, updateRating } from "../data/apiCalls";
import Rating from "../components/Rating";
import { getStudent } from "../data/apiCalls";
import Loader from "../components/Loader";

function setUserRatings(email, dataArray) {
  let ratings = [];
  let index = null;
  if (dataArray !== undefined) {
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i].owner === email) {
        ratings.push(dataArray[i]);
        index = i;
      }
    }
  }
  if (ratings.length > 0) {
    ratings[0].index = index;
    return ratings[0];
  } else
    return {
      communication: 0,
      participation: 0,
      qualityOfWork: 0,
      teamWork: 0,
      punctual: 0,
      attitude: 0,
      index: 0,
      new: true,
    };
}

const Rate = (props) => {
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    //rerender
  }, [loading]);

  const data = props.data;
  const [errorMessage, setErrorMessage] = useState("");

  const previousRatings = setUserRatings(
    localStorage.getItem("email"),
    data.ratings
  );

  const [communicationValue, setCommunicationValue] = useState(
    previousRatings.communication
  );
  const [participationValue, setParticipationValue] = useState(
    previousRatings.participation
  );
  const [qualityOfWorkValue, setQualityOfWorkValue] = useState(
    previousRatings.qualityOfWork
  );
  const [teamWorkValue, setTeamWorkValue] = useState(previousRatings.teamWork);
  const [punctualValue, setPunctualValue] = useState(previousRatings.punctual);
  const [attitudeValue, setAttitudeValue] = useState(previousRatings.attitude);

  async function submitData() {
    let result = null;
    if (
      !(
        communicationValue === 0 ||
        participationValue === 0 ||
        qualityOfWorkValue === 0 ||
        teamWorkValue === 0 ||
        punctualValue === 0 ||
        attitudeValue === 0
      )
    ) {
      if (previousRatings.new) {
        result = await addRating(
          data.lookupName,
          communicationValue,
          participationValue,
          qualityOfWorkValue,
          teamWorkValue,
          punctualValue,
          attitudeValue,
          localStorage.getItem("email")
        );
      } else {
        result = await updateRating(
          data.lookupName,
          communicationValue,
          participationValue,
          qualityOfWorkValue,
          teamWorkValue,
          punctualValue,
          attitudeValue,
          data.index,
          localStorage.getItem("email")
        );
      }
      setErrorMessage(result.message);
      return result;
    } else setErrorMessage("Fill out all the categories.");
    return;
  }

  useEffect(() => {
    //render
  }, []);

  useEffect(() => {
    //rerender
  }, [data]);

  return (
    <article className="relative z-10 mx-5">
      {!!loading && <Loader />}
      <div className="absolute top-0 mt-4 w-full">
        <div className="flex border-4 border-solid border-gray-400 my-2 px-5 py-6 rounded-md bg-slate-50 text-black max-w-5xl shadow-lg">
          <form className="flex flex-row w-full justify-around ">
            <div className="flex flex-col">
              <Rating
                title="Communication"
                name="Communication"
                value={communicationValue}
                setValue={setCommunicationValue}
              />
              <Rating
                title="Participation"
                name="participation"
                value={participationValue}
                setValue={setParticipationValue}
              />
              <Rating
                title="Quality Of Work"
                name="qualityOfWork"
                value={qualityOfWorkValue}
                setValue={setQualityOfWorkValue}
              />
            </div>

            <div className="flex flex-col">
              <Rating
                title="Team Work"
                name="teamWork"
                value={teamWorkValue}
                setValue={setTeamWorkValue}
              />
              <Rating
                title="Punctuality"
                name="punctual"
                value={punctualValue}
                setValue={setPunctualValue}
              />
              <Rating
                title="Attitude"
                name="attitude"
                value={attitudeValue}
                setValue={setAttitudeValue}
              />
            </div>
          </form>
          <div className="self-end">
            {errorMessage !== "" && (
              <div className="bg-red-600 text-white rounded-md mb-5 w-36 p-2 text-center">
                <h2 className="font-bold">Error:</h2>
                <p>{errorMessage}</p>
              </div>
            )}

            <button
              className="px-10 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded teamWork:outline-none teamWork:shadow-outline"
              onClick={() => {
                setLoading(true);
                submitData().then((res) => {
                  if (res) {
                    if (res.status === 200) {
                      getStudent(data.lookupName).then((res) => {
                        props.setData(res.data);
                      });
                      props.setShowRateWindow(false);
                    }
                  }
                });
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Rate;
