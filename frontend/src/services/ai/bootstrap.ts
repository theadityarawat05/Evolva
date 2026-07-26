import AIService
from "./AIService";

class Bootstrap{

private service=
new AIService();

async start(){

await this.service
.initialize();

}

}

export default
new Bootstrap();

