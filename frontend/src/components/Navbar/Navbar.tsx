import styles from "./Navbar.module.css";

const Navbar = () => {

    const userName =
        localStorage.getItem("user_name") || "User";

    return (
        <header className={styles.navbar}>
            <h2>
                Welcome, {userName} 👋
            </h2>
        </header>
    );

};

export default Navbar;