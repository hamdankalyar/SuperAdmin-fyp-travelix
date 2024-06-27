import React, { useState } from "react";
import {
  FaHome,
  FaUserCheck,
  FaUsers,
  FaChartPie,
  FaCog,
  FaBars,
  FaSignOutAlt,
  FaUser,
  FaCreditCard,
} from "react-icons/fa";
import "./Sidebar.css"; // Assuming you have a corresponding CSS file for styling
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSelector, logoutUser } from "../../assets/features/loginSlice";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const { userInfo } = useSelector(loginSelector);
  const navigate = useNavigate();
  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItem = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Payment Transfer", icon: <FaCreditCard />, path: "/payments" },
    { name: "Payment History", icon: <FaCreditCard />, path: "/history" },
    { name: "Users", icon: <FaUser />, path: "/users" },
    { name: "Verification", icon: <FaUserCheck />, path: "/verification" },
    { name: "Send Email", icon: <FaUserCheck />, path: "/email" },
    // { name: 'Customers', icon: <FaUsers />, path: '/customers' },
    // { name: 'Feedback', icon: <FaComments />, path: '/feedback' },
    // { name: 'Chat Support', icon: <FaComments />, path: '/chat-support' },
    // { name: 'Reports', icon: <FaChartPie />, path: '/reports' },
    // { name: 'Settings', icon: <FaCog />, path: '/settings' },
  ];
  const userProfile = {
    name: "Admin Name",
    imageUrl:
      "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg", // Placeholder image, replace with actual profile image URL
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/", { replace: true });

    // Additional logic for redirection or cleanup can be added here
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <FaBars onClick={toggleSidebar} />
      </div>
      <div className={`user-profile ${collapsed ? "collapsed" : ""}`}>
        <img src={userInfo?.image} alt="Profile" className="profile-picture" />
        {!collapsed && <div className="user-name">{userInfo?.name}</div>}
      </div>
      <ul className="sidebar-menu">
        {menuItem.map((item, index) => (
          <li
            key={index}
            className={`menu-item ${collapsed ? "collapsed" : ""}`}
          >
            <Link to={item.path}>
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div
        className={`sidebar-footer ${collapsed ? "collapsed" : ""}`}
        onClick={handleLogout}
      >
        <div
          href="/logout"
          className={`${collapsed ? "footer-collapsed" : ""}`}
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
