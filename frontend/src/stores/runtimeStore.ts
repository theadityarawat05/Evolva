import {
  create,
} from "zustand";

import Runtime
from "../services/ai/Runtime";

interface RuntimeStore {

  runtime:
    Runtime;

  ready:
    boolean;

  initialize():
    Promise<void>;

}

export const useRuntimeStore =
create<RuntimeStore>(
(set)=>({

runtime:
new Runtime(),

ready:false,

async initialize(){

const runtime =
new Runtime();

await runtime
.initialize();

set({

runtime,

ready:true,

});

},

}),
);

