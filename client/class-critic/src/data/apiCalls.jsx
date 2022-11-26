import axios from "axios";
import { inputCleanUp } from "../functions/inputCleanup"

// const clientPort = process.env.REACT_APP_CLIENT_PORT || "3001";
// const clientHost = process.env.REACT_APP_CLIENT_HOST_NAME || "127.0.0.1";
// const clientProtocol = process.env.REACT_APP_CLIENT_PROTOCOL || "http";
// const URL = `${clientProtocol}://${clientHost}:${clientPort}`;
  
// const URL = "http://localhost:3000";

const PORT = "";
const URL = "" + PORT;

axios.defaults.headers.common = {
  Authorization: `bearer ${localStorage.getItem("token")}`,
};


// search for students
export async function search(query) {  
  const options = {
    path: "/student/search",
    query: "?search=",
  };

  const APIheader = {};
  const APIparams = {};
  query = inputCleanUp(query);

  const url = `${URL}${options.path}${options.query}${query}`;

  try {
    const response = await axios.get(url, {
      headers: APIheader,
      params: APIparams,
      timeout: 20000,
    });    

    if (response.status !== 200) {
      console.log("error:", response.status);
      return {
        error: true,
        status: response.status,
        message: response.message,
      };
    } else {
      return response;
    }
  } catch (error) {
    console.log("error:", error);
    return {
      error: true,
      status: 500,
      message: "Internal api server error",
    };
  }
}

// login
export async function login(email, password) {
  const options = {
    path: "/user/login",
  };

  const url = `${URL}${options.path}`;

  try {
    const response = await axios.post(url, {
      email: email,
      password: password,
      timeout: 20000,
    });

    if (response.status !== 200) {
      console.log("error:", response.status);
      return {
        error: true,
        status: response.status,
        message: response.message,
      };
    } else {      
      localStorage.clear();
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("fName", response.data.fName);
      localStorage.setItem("lName", response.data.lName);
      localStorage.setItem("email", response.data.email);
      return response;
    }
  } catch (error) {
    console.log("error:", error);
    return {
      error: true,
      status: error.response.status,
      message: error.response.data.message,
    };
  }
}

// register a new user
export async function register(fName, lName, email, password) {
  const options = {
    path: "/user/register",
  };

  const url = `${URL}${options.path}`;

  try {
    const response = await axios.post(url, {
      fName: fName,
      lName: lName,
      email: email,
      password: password,
      timeout: 20000,
    });

    if (response.status !== 200) {
      console.log("error:", response.status);
      return {
        error: true,
        status: response.status,
        message: response.message,
      };
    } else {
      return {response};
    }
  } catch (error) {
    console.log("error:", error);
    return {
      error: true,
      status: error.response.status,
      message: error.response.data.message,
    };
  }
}

//update user details
export async function updateUser(fName, lName, email, password) {
  const options = {    
    path: `/user/${email}/profile`,
  };

  const url = `${URL}${options.path}`;
  try {
    const response = await axios.put(url, {      
      fName: fName,
      lName: lName,
      email: email,
      password: password,
      timeout: 20000,
    });

    if (response.status !== 200) {
      console.log("error:", response.status);
      return {
        error: true,
        status: response.status,
        message: response.message,
      };
    } else {
      return response.data.message;
    }
  } catch (error) {
    console.log("error:", error);
    return {
      error: true,
      status: error.response.status,
      message: error.response.data.message,
    };
  }
}

//add a new student
export async function addStudent(
  fName,
  lName,
  gender,
  uni,
  major,
  ){
  

  
    const options = {    
    path: "/student/add-student",
  };

  const url = `${URL}${options.path}`;

  try {


    const response = await axios.post(url, {

      fName: fName,
      lName: lName,
      gender: gender,
      uni: uni,
      major: major,
      timeout: 20000,
    });

    if (response.status !== 200) {
      console.log("error:", response.status);
      return {
        error: true,
        status: response.status,
        message: response.message,
      };
    } else {
      return {response};
    }
  } catch (error) {
    console.log("error:", error);
    return {
      error: true,
      status: error.response.status,
      message: error.response.data.message,
    };
  }
}

// add a student rating
export async function addRating(student,communication,participation,qualityOfWork,teamWork,punctual,attitude,owner) {
  const options = {    
    path: "/student/add-rating",
    query: "?student=",
  };

  const APIheader = {Authorization: `bearer ${localStorage.getItem("token")}`,};
  const APIparams = {};

  const url = `${URL}${options.path}${options.query}${student}&communication=${communication}&participation=${participation}&qualityOfWork=${qualityOfWork}&teamWork=${teamWork}&punctual=${punctual}&attitude=${attitude}&owner=${owner}`;

  try {
    const response = await axios.get(url, {
      headers: APIheader,
      params: APIparams,
      timeout: 20000,
    });    

    if (response.status !== 200) {
      console.log("error:", response.status);
      return {
        error: true,
        status: response.status,
        message: response.message,
      };
    } else {
      return response;
    }
  } catch (error) {
    console.log("error:", error);
    return {
      error: true,
      status: error.response.status,
      message: error.response.data.message,
    };
  }
}

// update student rating
export async function updateRating(student,communication,participation,qualityOfWork,teamWork,punctual,attitude,owner,index) {
  console.log("Authorization:-", `bearer ${localStorage.getItem("token")}`);
  const options = {
    path: "/student/update-rating",
    query: "?student=",
  };

  const APIheader = {Authorization: `bearer ${localStorage.getItem("token")}`,};
  const APIparams = {};

  const url = `${URL}${options.path}${options.query}${student}&communication=${communication}&participation=${participation}&qualityOfWork=${qualityOfWork}&teamWork=${teamWork}&punctual=${punctual}&attitude=${attitude}&owner=${owner}&&owner=${index}`;

  try {
    const response = await axios.get(url, {      
      headers: APIheader,
      params: APIparams,
      timeout: 20000,
    });

    if (response.status !== 200) {
      console.log("error:", response.status);
      return {
        error: true,
        status: response.status,
        message: response.message,
      };
    } else {
      return response;
    }
  } catch (error) {
    console.log("error:", error);
    return {
      error: true,
      status: error.response.status,
      message: error.response.data.message,
    };
  }
}

// get student details
export async function getStudent(student) {
  const options = {
    path: "/student/get-student",
    query: "?lookupName=",
  };

  const APIheader = {};
  const APIparams = {};

  const url = `${URL}${options.path}${options.query}${student}`;

  try {
    const response = await axios.get(url, {
      headers: APIheader,
      params: APIparams,
      timeout: 20000,
    });

    if (response.status !== 200) {
      console.log("error:", response.status);
      return {
        error: true,
        status: response.status,
        message: response.message,
      };
    } else {
      return response;
    }
  } catch (error) {
    console.log("error:", error);
    return {
      error: true,
      status: 500,
      message: "Internal api server error",
    };
  }
}

// Get university list
export async function getUnis() {
  const options = {
    path: "/uni/get-all",    
  };

  const APIheader = {};
  const APIparams = {};

  const url = `${URL}${options.path}`;

  try {
    const response = await axios.get(url, {
      headers: APIheader,
      params: APIparams,
      timeout: 20000,
    });

    if (response.status !== 200) {
      console.log("error:", response.status);
      return {
        error: true,
        status: response.status,
        message: response.message,
      };
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("error:", error);
    return {
      error: true,
      status: 500,
      message: "Internal api server error",
    };
  }
}
