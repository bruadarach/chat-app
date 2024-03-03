import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extracTime";
import { MessageProps } from "../../utils/types";

interface MessagePropsType {
  message: MessageProps;
}

const Message = ({ message }: MessagePropsType) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser?._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser?.profilePic
    : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-600" : "bg-gray-900";
  const formattedTime = extractTime(message.createdAt);

  return (
    <>
      <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full bg-gray-200">
            <img alt="profile picture" src={profilePic} />
          </div>
        </div>
        <div className={`chat-header my-0.5 ml-2 ${fromMe ? "mr-1" : "ml-2"}`}>
          {/* {fromMe ? authUser?.fullName : selectedConversation?.fullName} */}
        </div>
        <div className={`chat-bubble text-gray-300 ${bubbleBgColor}`}>
          {message.message}
        </div>
        <div
          className={`chat-footer opacity-50 text-xs my-0.5 ${
            fromMe ? "mr-0.5" : "ml-1.5"
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </>
  );
};

export default Message;
