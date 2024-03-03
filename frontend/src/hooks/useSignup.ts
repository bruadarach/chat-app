import { useState } from "react";
import toast from "react-hot-toast";
import { SignupForm } from "../utils/types";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }: SignupForm) => {
    const success = handleInputErrors({
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    });

    if (!success) return;

    setLoading(true);
    try {
      const result = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });

      const data = await result.json();

      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Signup successful");
      navigate("/login");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputErrors({
  fullName,
  username,
  password,
  confirmPassword,
  gender,
}: SignupForm): boolean {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return false;
  }

  return true;
}
