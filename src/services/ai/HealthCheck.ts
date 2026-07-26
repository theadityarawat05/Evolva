import AIService
from "./AIService";

export default
class HealthCheck{

static async run(){

const ai=
new AIService();

await ai
.initialize();

return true;

}

}

