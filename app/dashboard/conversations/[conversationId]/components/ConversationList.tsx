"use client";
import useConversation from "@/app/hooks/useConversation";
import {FullConversationType} from "@/app/types";
import {User} from "@prisma/client";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import React, {useEffect, useMemo, useState} from "react";
import {HiUserGroup} from "react-icons/hi";
import ConversationBox from "./ConversationBox";
import {find, uniq} from "lodash";
import {pusherClient} from "@/app/libs/pusher";
import GroupChatModal from "./GroupChatModal";
import Link from "next/link";
import {HiChevronLeft} from "react-icons/hi2";
interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({initialItems, users}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {conversationId, isOpen} = useConversation();
  const router = useRouter();
  const session = useSession();
  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, {id: conversation.id})) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });
      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:remove", removeHandler);
  }, [pusherKey, router, conversationId]);

  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center space-x-2">
            <Link
              href="/dashboard/conversations"
              className="block transition cursor-pointer text-dark_shadow dark:text-light_shadow hover:text-dark hover:text-light"
            >
              <HiChevronLeft size={24} />
            </Link>
            <div className="text-2xl font-bold text-dark dark:text-light">Messages</div>
          </div>
          <div
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center p-2 rounded-full cursor-pointer bg-light dark:bg-dark hover:opacity-75"
          >
            <HiUserGroup size={20} className="text-dark dark:text-light" />
          </div>
        </div>
        <div className="w-full h-full overflow-y-auto">
          {items.map((item) => (
            <ConversationBox key={item.id} data={item} selected={conversationId === item.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ConversationList;
