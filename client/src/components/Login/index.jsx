import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { GoogleSignInAPIRedirect } from "./../../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useUser } from "../../features/contexts/UserContext";
import LogoContainer from "./../LogoContainer";
import Divider from "../Divider";
import Button from "react-bootstrap/Button";

const Login = () => {
  const { user, setUser } = useUser();

  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user, navigate]);

  const onSubmit = (data) => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        setUser(userCredential.user);
        navigate("/feed");
      })
      .catch((error) => {
        console.error("Error signing in: ", error.message);
        alert("Error signing in: " + error.message);
      });
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then((result) => {
        const isNewUser = result.additionalUserInfo?.isNewUser;
        const user = result.user;
        setUser(result.user);
        if (isNewUser) {
          addUserToFirestore(user);
        }
        navigate("/feed");
      })
      .catch((error) => {
        console.error("Error signing in with Google: ", error.message);
        alert("Error signing in with Google: " + error.message);
      });
  };

  const addUserToFirestore = async (userData, formData) => {
    try {
      const userId = userData.uid;
  
      const userProfile = {
        userID: userId,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        profilePicture: formData.profilePicture || "",
        title: formData.title || "",
        education: formData.education || "",
        skills: formData.skills || [],
        interests: formData.interests || [],
        bio: formData.bio || "",
        followersCount: 0,
        posts: [],
        comments: [],
        experience: formData.experience || [],
        contacts: formData.contacts || [],
        createdAt: new Date(),
        lastLogin: new Date(),
        // userID: Unique user identifier.
        // firstName: The user's first name.
        // lastName: Last name of the user.
        // profilePicture: URL of the user's avatar.(maybe)
        // title: The user's title or job position.
        // education: The user's educational background, e.g. "Master's Student (Computer Science) - Boston University".
        // skills: A list or array of all the skills listed by the user.
        // interests: A list or array of companies or other interests that the user follows.
        // bio: A profile or personal description of the user.

        // followersCount: The number of followers the user has.
        // posts: A list of IDs of posts related to the user.
        // comments: A list of IDs of comments related to the user.

        // experience: A list or array of items, each of which contains the following fields:
        // position: The name of the position.
        // company: The name of the company or organization.
        // location: Location of the job.
        // startDate: Start date.
        // endDate: End date or current.
        // description: Description or responsibility for the experience.

        // contacts: A list or array of all the contact information provided by the user, such as email, phone number, etc.

        // createdAt: The date and time the user created the account.
        // lastLogin: The date and time the user last logged in.
      };
  
      await setDoc(doc(db, "users", userId), userProfile);
      console.log("User profile saved successfully");
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  return (
    // <div>
    //    <LogoContainer />
    //    <div>
    //     <h1>Welcome back, We missed you</h1>
    //    </div>
    //     <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)} noValidate>
    //       <div className={styles.formContent}>
    //       <label>Email: </label>
    //       <input type='email' id='email' className={styles.formInput}
    //        {...register('email',{
    //         required:{
    //           value: true,
    //           message : "Email is required!"
    //         },
    //         pattern:{
    //           value : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //           message : "Invalid email format"
    //         }
    //        })}></input>
    //       <p className={styles.errors}>{errors.email?.message}</p>
    //       <label>Password: </label>
    //       <input type='password' id='password' className={styles.formInput}
    //        {...register('password',{
    //         required:{
    //           value : true,
    //           message : "Password is required!"
    //         },
    //           minLength:{
    //             value : 8 ,
    //             message : "Password must be at least 8 characters long."
    //           }

    //       })}></input>
    //       <p className={styles.errors}>{errors.password?.message}</p>
    //       <button className={styles.signInBtn}>Sign In</button>
    //       {/* <Button className={styles.signInBtn}>Sign In</Button> */}
    //       </div>
    //     </form>

    //   <Divider />
    //     <div className={styles.googleSignIn}>
    //      <img src='/public/flat-color-icons_google.svg' alt='google logo' />
    //      <button onClick={handleGoogleSignIn}> Sign in with Google</button>
    //     </div>

    // </div>
    <>
      <LogoContainer />
      <div className={styles.registerContainer}>
        <h1>Welcome back, We missed you</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required!",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
            />
            <p className={styles.error}>{errors.email?.message}</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password", {
                  required: "Password is required!",
                  pattern: {
                    value:
                      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/,
                    message:
                      "Password must contain at least one lowercase letter, one uppercase letter, one special character, and at least 8 digits without spaces.",
                  },
                })}
                className={styles.passwordInput}
              />
            </div>
            <p className={styles.error}>{errors.password?.message}</p>
          </div>

          <Button
            id="registerButton"
            variant="primary"
            size="lg"
            className={styles.registerBtn}
            type="submit"
            style={{ backgroundColor: "#7F61A9" }}
          >
            Sign In
          </Button>

          <Divider />

          <div className={styles.googleSignIn}>
            <img src="/public/flat-color-icons_google.svg" alt="google logo" />
            <button type="button" onClick={handleGoogleSignIn} className={styles.GSignInBtn}>
              {" "}
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
