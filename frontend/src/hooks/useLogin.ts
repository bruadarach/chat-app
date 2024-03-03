import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { LoginForm } from "../utils/types";

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useAuthContext();

  const login = async (username: string, password: string) => {
    const success = handleInputErrors({
      username,
      password,
    });

    if (!success) return;

    setLoading(true);

    try {
      const result = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await result.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // localstorage - save it to localstorage
      localStorage.setItem("chat-user", JSON.stringify(data));
      // context - to navigate to home page - update the context
      setAuthUser(data);
      toast.success("Login successful");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors({ username, password }: LoginForm): boolean {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return false;
  }

  return true;
}
