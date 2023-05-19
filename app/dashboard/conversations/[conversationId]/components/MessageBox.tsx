import Avatar from "@/app/dashboard/components/Avatar";
import {FullMessageType} from "@/app/types";
import {useSession} from "next-auth/react";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {format} from "date-fns";
import Image from "next/image";
import ImageModal from "./ImageModal";
interface MessageBoxProps {
  isLast?: boolean;
  data: FullMessageType;
}
const MessageBox: React.FC<MessageBoxProps> = ({isLast, data}) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email == data?.sender?.email;

  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) =>
      user.firstName && user.lastName ? user.firstName + " " + user.lastName : user.email
    )
    .join(", ");

  const name = useMemo(() => {
    if (data.sender.lastName && data.sender.firstName) {
      return data.sender.lastName + " " + data.sender?.firstName;
    }
    return data.sender.email;
  }, [data.sender.lastName, data.sender.firstName, data.sender.email]);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [isWideText, setIsWideText] = useState(false);
  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.getBoundingClientRect().width;
      setIsWideText(width > 300);
    }
  }, [data.body]);
  return (
    <div className={`flex gap-3 p-4 ${isOwn && "justify-end"}`}>
      <div className={`${isOwn && "order-2"}`}>
        <Avatar userEmail={data.sender.email} url={data.sender.image} type="User" />
      </div>
      <div className={`flex flex-col gap-2 ${isOwn && "items-end"}`}>
        <div className="flex items-center gap-1">
          <div className="text-sm font-semibold text-dark dark:text-light">{name}</div>
          <div className="text-xs text-dark dark:text-light">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div
          className={`text-sm w-fit overflow-hidden ${
            isOwn ? "bg-light dark:bg-dark text-black dark:text-light" : "bg-red-300"
          }
           ${data?.image ? "rounded-md p-0" : "rounded-md py-2 px-3"}`}
        >
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              alt="Image"
              height="288"
              width="288"
              className="object-cover transition cursor-pointer hover:scale-110 translate"
            />
          ) : (
            <div className="flex justify-start">
              <p ref={textRef} className={`${isWideText ? "w-[300px] break-words" : "w-full"}`}>
                {data.body}
              </p>
            </div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-dark dark:text-light">{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
