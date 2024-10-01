import { TextField } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User Successfully Logged In");
      toast.success("User Successfully Logged In");
    } catch (error) {
      console.error("Error Logging In User : ", error.message);
      toast.error(`${error.message}`);
    }
  };

  const routeToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#6DB23A]">
      <ToastContainer />
      <div className="w-[90%] relative md:w-[70%] bg-[#FFFFFF] pt-[60px] pb-[60px] rounded-[10px] flex flex-col justify-center items-center gap-5">
        <img
          src="./logo.png"
          alt="Logo"
          className="w-[25%] md:w-[30%] max-w-[30%] h-auto"
        />
        <h2 className="text-center font-bold lg:text-[30px] md:text-[25px] text-[20px]">
          Login
        </h2>

        <form
          className="w-[90%] md:w-[60%] flex gap-2 flex-col justify-center items-center"
          onSubmit={handleLogin}
        >
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full outline-none"
            type="email"
            required
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full outline-none"
            type="password"
            required
          />
          {/* <div className='my-3' ><h3>Forget Password?</h3></div> */}
          <div className="flex flex-col w-full gap-y-1">
            <Link to={"/ForgotPassword"} className="w-full text-end">
              Forgot Password
            </Link>
            <button
              type="submit"
              className="bg-white hover:bg-[#6DB23A] text-[#6DB23A] hover:text-[white] text-lg font-semibold py-2 px-4 w-[100%] border-2 border-[#6DB23A] rounded shadow"
            >
              Login
            </button>
          </div>
        </form>
        <h3>Not a Member?</h3>
        <button
          onClick={routeToSignup}
          className="bg-white hover:bg-[#F2B145] text-[#F2B145] hover:text-[white] text-lg font-semibold py-2 px-4 w-[90%] md:w-[60%] border-2 border-[#F2B145] rounded shadow"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
