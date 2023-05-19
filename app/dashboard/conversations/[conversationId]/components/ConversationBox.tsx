"use client";
import Avatar from "@/app/dashboard/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import {FullConversationType} from "@/app/types";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {format} from "date-fns";
import AvatarGroup from "@/app/dashboard/components/AvatarGroup";
interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({data, selected}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/dashboard/conversations/${data.id}`);
  }, [data.id, router]);
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];
    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  const name = useMemo(() => {
    if (data.name) {
      return data.name;
    }
    if (otherUser?.lastName && otherUser?.firstName) {
      return otherUser.lastName + " " + otherUser?.firstName;
    }
    return otherUser.email;
  }, [otherUser.lastName, otherUser.firstName, otherUser.email, data.name]);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [isWideText, setIsWideText] = useState(false);
  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.getBoundingClientRect().width;
      setIsWideText(width > 300);
    }
  }, [lastMessageText]);
  return (
    <div
      onClick={handleClick}
      className={`relative flex items-center w-full p-3 space-x-3 rounded-lg cursor-pointer mt-1 transition duration-200 ${
        selected
          ? "bg-light dark:bg-dark hover:bg-[#BFBFBF] hover:dark:bg-[#19242F]"
          : "bg-[#BFBFBF] dark:bg-[#19242F] hover:bg-light hover:dark:bg-dark"
      }`}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar userEmail={otherUser.email} url={otherUser.image} type="User" />
      )}
      <div className="flex-1 min-w-0">
        <div className="focus:outline-none">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-dark dark:text-light text-md">{name}</p>
            {lastMessage?.createdAt && (
              <p className="text-xs font-light text-dark dark:text-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            ref={textRef}
            style={{WebkitLineClamp: isWideText ? 2 : "initial"}}
            className={`${isWideText ? "line-clamp-2" : ""} text-sm ${
              hasSeen ? "text-dark dark:text-light" : "text-dark dark:text-light font-medium"
            }
            `}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
