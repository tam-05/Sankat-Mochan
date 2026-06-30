import styles from "./SettingsPage.module.css";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
    return (
        <div className={styles.settingsPage}>
            <div className={styles.container}>

                <h1 className={styles.title}>⚙️ Settings</h1>
                <p className={styles.subtitle}>
                    Manage your account and application preferences.
                </p>

                <div className={styles.card}>
    <h2>👤 Profile</h2>

    <div className={styles.infoRow}>
        <span>Name</span>
        <strong>{localStorage.getItem("user_name") || "User"}</strong>
    </div>

    <div className={styles.infoRow}>
        <span>Email</span>
        <strong>{localStorage.getItem("user_email") || "Not Available"}</strong>
    </div>
</div>

                <div className={styles.card}>
    <h2>🎨 Appearance</h2>

    <div className={styles.infoRow}>
        <span>Current Theme</span>
        <strong>Dark Mode</strong>
    </div>

    <div className={styles.infoRow}>
        <span>Version</span>
        <strong>v1.0</strong>
    </div>
</div>
               <div className={styles.card}>
    <h2>🤖 AI Settings</h2>

    <div className={styles.infoRow}>
        <span>AI Model</span>
        <strong>Gemini 2.5 Flash</strong>
    </div>

    <div className={styles.infoRow}>
        <span>Roadmap Generator</span>
        <strong>Enabled ✅</strong>
    </div>

    <div className={styles.infoRow}>
        <span>Regeneration</span>
        <strong>Enabled ✅</strong>
    </div>
</div>
                <div className={styles.card}>
    <h2>🚪 Account</h2>

    <div className={styles.infoRow}>
        <span>Logged in as</span>
        <strong>{localStorage.getItem("user_email")}</strong>
    </div>

    <button
        className={styles.logoutButton}
        onClick={() => {
            localStorage.clear();
            navigate("/login");
        }}
    >
        Logout
    </button>
</div>

            </div>
        </div>
    );
};

export default SettingsPage;