import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ConversationProps } from "../utils/types";

const useGetConversations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  useEffect(() => {
    setLoading(true);

    const getConversations = async () => {
      setLoading(true);
      try {
        const result = await fetch("/api/users");
        const data = await result.json();

        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
