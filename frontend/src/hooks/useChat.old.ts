import {
 useState,
} from "react";

import AIService
from "../services/ai/AIService";

import {
  useChatStore,
} from "../stores/chatStore";

export default function
useChat(){

const{

messages,

add,

}=
useChatStore();

const
[loading,
setLoading]=
useState(false);

const service = React.useMemo(
  () => new AIService(),
  []
);

async function
send(
text:string,){

setLoading(true);

const user={

id:
Date.now()
.toString(),

role:"user",

content:text,

createdAt:
Date.now(),

};

add(user);

const response=

await service.ask(

messages,

text,

);

add({

id:
response.id,

role:
"assistant",

content:
response.text,

createdAt:
Date.now(),

});

setLoading(false);

}

return{

messages,

loading,

send,

};

}

