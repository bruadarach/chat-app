import useLogout from "../../hooks/useLogout";
import { BiLogOut } from "react-icons/bi";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <div
      className="mt-auto flex items-center gap-2 cursor-pointer"
      onClick={logout}
    >
      {!loading ? (
        <BiLogOut className="w-6 h-6 text-white cursor-pointer" />
      ) : (
        <span className="loading loading-spinner"></span>
      )}
      <span className="text-white">Logout</span>
    </div>
  );
};

export default LogoutButton;
