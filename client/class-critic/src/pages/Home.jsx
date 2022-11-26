import Header from "../components/Header";
import FrontCard from "../components/FrontCard";
import { useState } from "react";
import React, { useEffect } from "react";
import { search } from "../data/apiCalls";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  let searchData = useLocation(location);
  
  // check if search data is passed in else default to empty
  if (searchData.state) {
    searchData = searchData.state.search;
  } else {
    searchData = "";
  }  

  const [data, setData] = useState();

  useEffect(() => {
    //rerender
  }, []);

  useEffect(() => {
    //rerender    
    search(searchData).then((resp) => {
      setData(resp.data);
      return resp.data;
    });
  }, [searchData]);


  return (
    <div className="bg-indigo-900 text-white flex flex-col h-full">
      <Header/>
      <div className="my-10"></div>
      {
        data ? (
          <div>
            {data.data.map((item) => (
              <FrontCard data={item} />
            ))}
          </div>
        )
        : (
          // fade in loading animation
        <div className="text-black bg-gray-50 w-1/2 border-gray-300 border-4 self-center rounded-lg fade-in">
          <h1 className=" bg-orange-500 text-white text-center font-bold text-2xl mb-4 border-b-2 border-orange-700 p-2">Problem ?</h1>
          <div className="text-left mx-auto mx-8 mb-4 font-semibold text-lg">
          <p>Data is still loading or has not been found.</p>
          <p>This could also be an input search error. Please check your search and try again.</p>
          <p>If the page does not load, network or server issues could be the problem.</p>
          <p className="text-center mt-4">Please wait...</p>
          </div>
        </div>
        )
      }
    </div>
  );
}

export default Home;
