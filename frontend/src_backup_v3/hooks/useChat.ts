
import {
useState,
useEffect,
} from "react";

import { Message } from "../types/message";

import {
getMessages,
saveMessage,
} from "../database/messages";

export function useChat() {
const [messages, setMessages] =
useState<Message[]>([]);

useEffect(() => {
loadMessages();
}, []);

function loadMessages() {
setMessages(
getMessages()
);
}

function sendMessage(
content: string
) {
const message: Message = {
id: Date.now().toString(),
role: "user",
content,
createdAt: Date.now(),
};

saveMessage(message);

setMessages((prev) => [
  ...prev,
  message,
]);

}

return {
messages,
sendMessage,
loadMessages,
};
}

