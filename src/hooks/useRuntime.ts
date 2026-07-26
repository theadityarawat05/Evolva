import {
  useEffect,
} from "react";

import {
  useRuntimeStore,
} from "../stores/runtimeStore";

export default function
useRuntime(){

const {

initialize,

ready,

runtime,

} =
useRuntimeStore();

useEffect(()=>{

initialize();

},[]);

return{

runtime,

ready,

};

}

