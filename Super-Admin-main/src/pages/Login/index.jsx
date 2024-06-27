import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSelector, loginUser } from "../../assets/features/loginSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, userInfo, error } = useSelector(loginSelector);

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(email, password));
  };

  // Redirect to dashboard if user is already logged in
  if (userInfo) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
        <form onSubmit={handleFormSubmit}>
          {error && <Message>{error}</Message>}
          {loading && <Loader />}
          <div className="mb-4">
            <Label htmlFor="email" value="Your email" />
            <TextInput
              id="email"
              type="email"
              placeholder="john@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" value="Your password" />
            <TextInput
              id="password"
              type="password"
              placeholder="********"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
