import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDollarSign,
  faThumbsUp,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./style.css";

const DashboardCards = () => {
  const [users, setUsers] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRentals, setActiveRentals] = useState(0);

  useEffect(() => {
    fetch("https://travelix-backend-v2.vercel.app/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    setServiceProviders(
      users.filter(
        (user) =>
          user.role === "carOwner" ||
          user.role === "hotelOwner" ||
          user.role === "tourOwner"
      )
    );
  }, [users]);

  useEffect(() => {
    fetch("http://localhost:3000/api/bookings/superAdmin/bookings/count")
      .then((response) => response.json())
      .then((data) => {
        setActiveRentals(data.totalBookingsCount);
      })
      .catch((error) =>
        console.error("Error fetching active rentals count:", error)
      );
  }, []);

  const stats = [
    {
      id: 1,
      title: "Total Users",
      value: users.length,
      icon: faUser,
    },
    {
      id: 2,
      title: "Service Providers",
      value: serviceProviders.length,
      icon: faThumbsUp,
    },
    {
      id: 3,
      title: "Active Rentals",
      value: activeRentals,
      icon: faCalendarCheck,
    }
  ];

  return (
    <div className="dashboard-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {loading ? (
        <div className="loader text-center text-lg">Loading...</div>
      ) : (
        stats.map((stat) => (
          <div
            key={stat.id}
            className="dashboard-card bg-white p-4 rounded shadow-md flex items-center space-x-4"
          >
            <FontAwesomeIcon
              icon={stat.icon}
              className="card-icon text-blue-500 text-4xl"
            />
            <div>
              <div className="card-title text-gray-700 font-semibold">
                {stat.title}
              </div>
              <div className="card-value text-2xl font-bold">{stat.value}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardCards;
