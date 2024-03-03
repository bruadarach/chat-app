import { useState } from "react";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";
import { ConversationProps } from "../../utils/types";
import { IoSearchOutline } from "react-icons/io5";

const SearchInput = () => {
  const [search, setSearch] = useState<string>("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search) return;

    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c: ConversationProps) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (!conversation) {
      return toast.error("No user found!");
    }

    setSelectedConversation(conversation);
    setSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered rounded-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-circle bg-yellow-500 text-white border-none hover:bg-customColor"
      >
        <IoSearchOutline className="w-4 h-4 outline-none" />
      </button>
    </form>
  );
};

export default SearchInput;
