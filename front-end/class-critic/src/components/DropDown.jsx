import Select from "react-select";

import React, { useEffect, useState } from "react";

const DropDown = (props) => {
  const list = props.list.map((item) => ({ value: item, label: item }));

  const handler = (e) => {
    props.setValue(e.value);
  };

  return (
    <div>
      <Select
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            paddingBlock: "0.2rem",
            borderRadius: "0.5rem",
            borderColor: state.isFocused ? "grey" : "black",
            borderWidth: 2,
            backgroundColor: state.isFocused ? "white" :"#f5f5f5",
            "&:hover": {
                borderColor: state.isFocused ? "grey" : "#a855f7",
                borderWidth: 2,
                backgroundColor: state.isFocused ? "white" :"#f5f5f5",
            }
          }),
        }}

        className="basic-single"
        classNamePrefix="select"
        placeholder={list[0]}
        defaultValue={list[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isRtl={false}
        isSearchable={false}
        name={props.name}
        onChange={(e) => handler(e)}
        options={list}
      />
    </div>
  );
};

export default DropDown;
