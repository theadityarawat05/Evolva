import {
  create,
} from "zustand";

import {
  ChatMessage,
} from "../services/ai";

interface ChatStore{

messages:
ChatMessage[];

add(
message:
ChatMessage,
):void;

clear():
void;

}

export const
useChatStore=
create<ChatStore>(
(set)=>({

messages:[],

add(message){

set(state=>({

messages:[

...state.messages,

message,

],

}));

},

clear(){

set({

messages:[],

});

},

}),
);

