
export interface ExtractedMemory {
content: string;

category: string;

confidence: number;
}

export function extractMemory(
text: string
): ExtractedMemory | null {

if (
text.length < 10
) {
return null;
}

return {
content: text,

category: "general",

confidence: 0.5,

};
}

