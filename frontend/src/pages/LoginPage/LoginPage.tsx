import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { LoginData } from "../../types/auth";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Globe
} from 'lucide-react';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
  register,
  handleSubmit,
  formState: { errors },
  
} = useForm<LoginData>();



 const onSubmit = async (data: LoginData) => {
  console.log("FORM SUBMITTED");
  console.log(data);

  try {
    const response = await loginUser(data);

   console.log("LOGIN RESPONSE:", response);
console.log("NAME:", response.name);
console.log("EMAIL:", response.email);

    localStorage.setItem("token", response.access_token);
    localStorage.setItem("user_name", response.name);
localStorage.setItem("user_email", response.email);

    alert("Login Successful!");

    navigate("/dashboard");
  } catch (error: any) {
  console.log(error);
  console.log(error.response);

  alert(error.response?.data?.detail || "Login Failed");
}
};

  return (
    <div className={styles.container}>
      {/* Background Elements */}
      <div className={styles.stars} />
      <div className={styles.nebula} />
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.authCardWrapper}>
        <div className={styles.glassCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logo}>
              <Sparkles size={32} className={styles.logoIcon} />
              <span>SANKAT MOCHAN</span>
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Access your neural command center</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  placeholder="name@cosmos.com"
                  className={errors.email ? styles.inputError : ''}
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Password</label>
                <a href="#" className={styles.forgotLink}>Forgot Password?</a>
              </div>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={errors.password ? styles.inputError : ''}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  className={styles.toggleBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.optionsRow}>
              <label className={styles.checkboxContainer}>
                <input type="checkbox" {...register('rememberMe')} />
                <span className={styles.checkmark}></span>
                Remember this device
              </label>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Initialize Session <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span>OR</span>
          </div>

          {/* Social Login */}
          <button type="button" className={styles.googleBtn}>
            <Globe size={18} />
            Continue with Google
          </button>

          {/* Footer */}
          <div className={styles.authSwitch}>
  <span>Don't have an account?</span>
  <Link to="/register">Sign Up</Link>
</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;