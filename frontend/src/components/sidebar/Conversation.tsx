import useConversation from "../../zustand/useConversation";
import { ConversationProps } from "../../utils/types";

const Conversation = ({
  conversation,
  lastIdx,
}: {
  conversation: ConversationProps;
  lastIdx: boolean;
}) => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-gray-900 rounded p-2 py-1 cursor-pointe cursor-pointer ${
          isSelected ? "bg-gray-900" : ""
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="avatar online py-1">
          <div className="w-10 rounded-full bg-gray-200">
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{conversation.fullName}</p>
          </div>
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 h-3" />}
    </>
  );
};

export default Conversation;
