import AIService from "./AIService";
import ChatRepository from "./ChatRepository";
import ConversationManager from "./ConversationManager";
import { Session } from "./Session";
import Logger from "../../utils/Logger";

class Bootstrap {
  private service = new AIService();

  async start() {
    Logger.info("Starting Evolva system boot...");

    await ChatRepository.initialize();

    const activeSession = new Session("default_main_session");
    if (activeSession.getConversationCount() === 0) {
      activeSession.createConversation("Default Conversation");
    }

    ConversationManager.initialize(activeSession);

    await this.service.initialize();

    Logger.info("Evolva system boot sequence completed.");
  }
}

export default new Bootstrap();
