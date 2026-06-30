import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import type { RegisterData } from "../../types/auth";
import { registerUser } from "../../services/authService";

import {
    Sparkles,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight
} from "lucide-react";

import styles from "./RegisterPage.module.css";

const RegisterPage: React.FC = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>();

    const password = watch("password");

    const onSubmit = async (data: RegisterData) => {

        try {

            await registerUser(data);

            alert("Registration Successful!");

            navigate("/login");

        } catch (error: any) {

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Registration Failed"
            );
        }
    };

    return (

        <div className={styles.container}>

            <div className={styles.stars} />
            <div className={styles.nebula} />
            <div className={styles.glowTop} />
            <div className={styles.glowBottom} />

            <div className={styles.authCardWrapper}>

                <div className={styles.glassCard}>

                    <div className={styles.header}>

                        <div className={styles.logo}>
                            <Sparkles
                                size={30}
                                className={styles.logoIcon}
                            />

                            <span>SANKAT MOCHAN</span>

                        </div>

                        <h1 className={styles.title}>
                            Create Account
                        </h1>

                        <p className={styles.subtitle}>
                            Create your Sankat Mochan account
                        </p>

                    </div>

                    <form
                        className={styles.form}
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        {/* Full Name */}

                        <div className={styles.inputGroup}>

                            <label>
                                Full Name
                            </label>

                            <div className={styles.inputWrapper}>

                                <User
                                    size={18}
                                    className={styles.inputIcon}
                                />

                                <input
                                    type="text"
                                    placeholder="Enter your full name"

                                    className={
                                        errors.name
                                            ? styles.inputError
                                            : ""
                                    }

                                    {...register("name", {
                                        required: "Full Name is required",
                                    })}
                                />

                            </div>

                        </div>

                        {/* Email */}

                        <div className={styles.inputGroup}>

                            <label>
                                Email Address
                            </label>

                            <div className={styles.inputWrapper}>

                                <Mail
                                    size={18}
                                    className={styles.inputIcon}
                                />

                                <input
                                    type="email"
                                    placeholder="name@example.com"

                                    className={
                                        errors.email
                                            ? styles.inputError
                                            : ""
                                    }

                                    {...register("email", {
                                        required: "Email is required",
                                    })}
                                />

                            </div>

                        </div>

                        {/* Password */}

                        <div className={styles.inputGroup}>

                            <label>Password</label>

                            <div className={styles.inputWrapper}>

                                <Lock
                                    size={18}
                                    className={styles.inputIcon}
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }

                                    placeholder="••••••••"

                                    className={
                                        errors.password
                                            ? styles.inputError
                                            : ""
                                    }

                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message:
                                                "Minimum 8 characters",
                                        },
                                    })}
                                />

                                <button
                                    type="button"
                                    className={styles.toggleBtn}
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}

                                </button>

                            </div>

                        </div>
                                                {/* Confirm Password */}

                        <div className={styles.inputGroup}>

                            <label>Confirm Password</label>

                            <div className={styles.inputWrapper}>

                                <Lock
                                    size={18}
                                    className={styles.inputIcon}
                                />

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }

                                    placeholder="Confirm your password"

                                    className={
                                        errors.confirmPassword
                                            ? styles.inputError
                                            : ""
                                    }

                                    {...register("confirmPassword", {
                                        required:
                                            "Please confirm your password",

                                        validate: (value) =>
                                            value === password ||
                                            "Passwords do not match",
                                    })}
                                />

                                <button
                                    type="button"
                                    className={styles.toggleBtn}
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                            {errors.confirmPassword && (
                                <small
                                    style={{
                                        color: "#ef4444",
                                        marginTop: "6px",
                                    }}
                                >
                                    {
                                        errors.confirmPassword
                                            .message
                                    }
                                </small>
                            )}

                        </div>

                        <button
                            type="submit"
                            className={styles.loginBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Creating Account..."
                                : "Create Account"}

                            <ArrowRight size={18} />
                        </button>

                    </form>

                    <div className={styles.authSwitch}>
                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Login
                        </Link>
                    </div>

                </div>

            </div>

        </div>

    );

};

export default RegisterPage;