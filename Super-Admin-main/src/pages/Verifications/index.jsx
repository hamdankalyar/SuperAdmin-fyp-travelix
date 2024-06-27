import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import BlueUnderline from "../../assets/underlineBlue2.svg";

// Component
const ConfirmationModal = ({ show, onClose, onConfirm, currentUser }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        show ? "block" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">
          {currentUser.name}{" "}
          <span className="text-gray-500">({currentUser.role})</span>
        </h3>
        <div className="mb-4">
          <h4 className="font-medium">Name:</h4>
          <p>{currentUser.name}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-medium">Email:</h4>
          <p>{currentUser.email}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-medium">Phone Number:</h4>
          <p>{currentUser.phone}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-medium">Bank Name:</h4>
          <p>{currentUser.bankName}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-medium">Account Number:</h4>
          <p>{currentUser.accountNumber}</p>
        </div>
        <h4 className="font-medium">Id Card Image:</h4>
        <div className="mb-4">
          <img
            className="w-full h-auto object-cover rounded"
            src={currentUser.idCardImage}
            alt="ID Card"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Reject
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => onConfirm(currentUser._id)}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:3000/api/users/serviceproviders")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  const verifyServiceProvider = async (serviceProviderId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/register/${serviceProviderId}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error verifying service provider:", error);
    }
  };

  const handleVerify = (serviceProviderId) => {
    verifyServiceProvider(serviceProviderId);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Service Providers Verification
            </h2>
            <img src={BlueUnderline} alt="Underline" className="mx-auto" />
          </div>
          {users.filter((user) => user.role !== "user").length === 0 ? (
            <div className="text-center bg-white p-6 rounded shadow-md">
              No service providers for verification.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 border-b">Sr. No</th>
                    <th className="py-2 px-4 border-b">Image</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Role</th>
                    <th className="py-2 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user.role !== "user")
                    .map((user, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b text-center">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <img
                            className="w-10 h-10 rounded-full mx-auto"
                            src={user.image}
                            alt="User"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">{user.name}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.role}</td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => {
                              setShowModal(true);
                              setCurrentUser(user);
                            }}
                          >
                            View Details
                          </button>
                          <ConfirmationModal
                            show={showModal}
                            onClose={() => setShowModal(false)}
                            onConfirm={handleVerify}
                            currentUser={currentUser}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Index;
