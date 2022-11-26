import React, { useEffect, useState } from "react";

const FrontCard = (props) => {
      

  const handleChange = (event) => {
    props.setValue(event.target.value);
  
  };

  return (
    <div>
      <label className="font-bold">{props.title}:</label>

      <div className="flex">
      {props.value === "2" ? (
          <p className="ml-2 text-amber-500 font-normal mr-2">Bad</p>
        ) : props.value === "1" ? (
          <p className="ml-2 text-red-500 font-normal mr-2">Bad</p>
        ) : (
          <p className="ml-2 text-gray-500 font-light mr-2">Bad</p>
        )}
        
        <input
          type="radio"
          id={`${props.name}-star1`}
          name={props.name}
          value={1}
          className="inline-block w-4 h-4 cursor-pointer mr-2 mb-4 mt-2"
          onChange={handleChange} 
          checked={props.value == 1 ? "checked" : ""}        
        />
        <label
          className="star"
          title="Awesome"
          aria-hidden="true"
        ></label>
        <input
          type="radio"
          id={`${props.name}-star2`}
          name={props.name}
          value={2}
          className="inline-block w-4 h-4 cursor-pointer mx-2 mb-4 mt-2"
          onChange={handleChange}
          checked={props.value == 2 ? "checked" : ""}
        />
        <label
          className="star"
          title="Great"
          aria-hidden="true"
        ></label>
        <input
          type="radio"
          id={`${props.name}-star3`}
          name={props.name}
          value={3}
          className="inline-block w-4 h-4 cursor-pointer mx-2 mb-4 mt-2"
          onChange={handleChange}
          checked={props.value == 3 ? "checked" : ""}
        />
        <label
          className="star"
          title="Very good"
          aria-hidden="true"
        ></label>
        <input
          type="radio"
          id={`${props.name}-star4`}
          name={props.name}
          value={4}
          className="inline-block w-4 h-4 cursor-pointer mx-2 mb-4 mt-2"
          onChange={handleChange}
          checked={props.value == 4 ? "checked" : ""}
        />
        <label className="star" title="Good" aria-hidden="true"></label>
        <input
          type="radio"
          id={`${props.name}-star5`}
          name={props.name}
          value={5}
          className="inline-block w-4 h-4 cursor-pointer ml-2 mt-2"
          onChange={handleChange}
          checked={props.value == 5 ? "checked" : ""}
        />

        {props.value === "4" ? (
          <p className="ml-2 text-orange-500 font-normal">Good</p>
        ) : props.value === "5" ? (
          <p className="ml-2 text-green-500 font-normal">Good</p>
        ) : (
          <p className="ml-2 text-gray-500 font-light">Good</p>
        )}

        <label className="star" title="Bad" aria-hidden="true"></label>
      </div>
    </div>
  );
};

export default FrontCard;
