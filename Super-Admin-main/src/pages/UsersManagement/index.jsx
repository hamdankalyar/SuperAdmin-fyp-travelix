import React, { useState, useEffect } from "react";
import axios from "axios";

const Index = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://travelix-backend-v2.vercel.app/api/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false); // Handle loading state properly on error
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/users/deleteUser/${userId}`
        );
        console.log("User deleted successfully:", response.data);
        fetchUsers(); // Refresh users after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRole === "All" || user.role === selectedRole)
  );

  return (
    <div className="user-management">
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <div className="search-container flex items-center mb-4">
            <input
              className="booking-search-input border border-gray-300 rounded-lg px-4 py-2 mr-2"
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="booking-search-select border border-gray-300 rounded-lg px-4 py-2"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="All">All Users</option>
              <option value="user">Customers</option>
              <option value="hotelOwner">Hotel Owner</option>
              <option value="tourOwner">Tour Owner</option>
              <option value="carOwner">Car Owner</option>
            </select>
          </div>
          <table className="user-table w-full">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      className="userM-userImg w-12 h-12 object-cover rounded-full"
                      src={user.image}
                      alt="User"
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="payment-block-btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Block User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Index;
