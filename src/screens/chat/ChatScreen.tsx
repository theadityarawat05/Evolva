import React, {
  useEffect,
} from "react";

import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import useChat
from "../../hooks/useChat";

import {
  AI_CONFIG,
} from "../../config/ai";

export default function ChatScreen(){

const{

messages,

loading,

send,

}=useChat();

const
[input,
setInput]=
React.useState("");

async function
handleSend(){

if(
!input.trim()
)return;

const text=input;

setInput("");

await send(text);

}

return(

<View style={styles.container}>

<FlatList

data={messages}

keyExtractor={
(item)=>item.id
}

contentContainerStyle={
styles.list
}

renderItem={({
item,
})=>(

<View
style={[
styles.bubble,

item.role===
"user"

?

styles.user

:

styles.ai,

]}>

<Text
style={
styles.text
}>

{item.content}

</Text>

</View>

)}

/>

{

loading&&(

<View
style={
styles.loading
}>

<ActivityIndicator/>

<Text>

Thinking...

</Text>

</View>

)

}

<View
style={
styles.bottom
}>

<TextInput

value={input}

onChangeText={
setInput
}

placeholder=
"Message Evolva"

style={
styles.input
}

/>

<TouchableOpacity

style={
styles.button
}

onPress={
handleSend
}

>

<Text
style={
styles.buttonText
}>

Send

</Text>

</TouchableOpacity>

</View>

</View>

);

}

const styles=
StyleSheet.create({

container:{

flex:1,

backgroundColor:
"#0F1115",

},

list:{

padding:16,

},

bubble:{

padding:14,

borderRadius:18,

marginBottom:10,

maxWidth:"85%",

},

user:{

alignSelf:"flex-end",

backgroundColor:"#4F46E5",

},

ai:{

alignSelf:"flex-start",

backgroundColor:"#22252B",

},

text:{

color:"#FFFFFF",

fontSize:16,

},

loading:{

flexDirection:"row",

alignItems:"center",

paddingHorizontal:20,

gap:10,

},

bottom:{

flexDirection:"row",

padding:16,

borderTopWidth:1,

borderTopColor:"#2A2A2A",

},

input:{

flex:1,

backgroundColor:"#20242A",

borderRadius:14,

paddingHorizontal:14,

color:"#FFF",

},

button:{

marginLeft:10,

paddingHorizontal:18,

justifyContent:"center",

borderRadius:14,

backgroundColor:"#4F46E5",

},

buttonText:{

color:"#FFF",

fontWeight:"700",

},

});

