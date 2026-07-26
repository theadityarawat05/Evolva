import AIService from "./AIService";
import ConversationManager from "./ConversationManager";
import { Session } from "./Session";

class Bootstrap {

  private service = new AIService();

  async start() {

    await this.service.initialize();

    const session = new Session();

    ConversationManager.initialize(session);

  }

}

export default new Bootstrap();
