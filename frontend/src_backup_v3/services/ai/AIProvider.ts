
export interface AIProvider {
sendMessage(
message: string
): Promise<string>;
}

