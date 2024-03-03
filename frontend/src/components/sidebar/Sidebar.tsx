import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";

const Sidebar = () => {
  return (
    <div className="border-r border-slate-400 p-4 flex flex-col">
      <SearchInput />
      <Conversations />
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
