
import { AIProvider } from "./AIProvider";

export class MockProvider
implements AIProvider {

async sendMessage(
message: string
): Promise<string> {

return `Evolva received: ${message}`;

}
}

