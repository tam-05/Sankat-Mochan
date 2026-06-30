import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Calendar
} from "lucide-react";

import styles from "./Sidebar.module.css";

const Sidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    // Remove saved login information
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");

    // Go back to login page
    navigate("/login");

  };

  return (
    <aside className={styles.sidebar}>

      <div className={styles.logo}>
        ✨
        <span>Sankat Mochan</span>
      </div>

      <nav className={styles.nav}>

        <NavLink to="/dashboard">
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/events">
    <Calendar size={20}/>
    Events
</NavLink>
 
      

        <NavLink to="/settings">
          <Settings size={20} />
          Settings
        </NavLink>

      </nav>

      <button
        className={styles.logout}
        onClick={handleLogout}
      >
        <LogOut size={20} />
        Logout
      </button>

    </aside>
  );
};

export default Sidebar;