import getConnections from "@/app/actions/getConnections";
import getConversationById from "@/app/actions/getConversationById";
import getConversations from "@/app/actions/getConversations";
import getMessages from "@/app/actions/getMessages";
import React from "react";
import Section from "../../components/Section";
import EmptyState from "../components/EmptyState";
import Body from "./components/Body";
import ConversationList from "./components/ConversationList";
import Form from "./components/Form";
import Header from "./components/Header";
interface IParams {
  conversationId: string;
}
const Message = async ({params}: {params: IParams}) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const conversations = await getConversations();
  const connections = await getConnections();
  return (
    <div className="flex flex-row gap-[1.5rem] h-full w-full">
      <Section fit="w-full md:w-1/3">
        <ConversationList initialItems={conversations} users={connections} />
      </Section>
      <Section fit="hidden md:inline md:w-2/3">
        {!conversation ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col h-full">
            <Header conversation={conversation} />
            <Body initialMessages={messages} />
            <Form />
          </div>
        )}
      </Section>
    </div>
  );
};

export default Message;
