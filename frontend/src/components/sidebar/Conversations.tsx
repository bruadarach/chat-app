import useGetConversations from "../../hooks/useGetConversations";
import { ConversationProps } from "../../utils/types";
import Conversation from "./Conversation";

const Conversations = () => {
  const { loading, conversations } = useGetConversations();

  return (
    <>
      <div className="divider my-0 h-3 pt-5 pb-1" />
      <div className="flex flex-col overflow-auto ">
        {loading ? (
          <span className="loading loading-spinner mx-auto"></span>
        ) : null}
        {conversations.map((conversation: ConversationProps, idx: number) => (
          <Conversation
            key={conversation._id}
            conversation={conversation}
            lastIdx={idx === conversations.length - 1}
          />
        ))}
      </div>
      <div className="divider my-0 h-3 mb-5" />
    </>
  );
};

export default Conversations;
