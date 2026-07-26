import { AIResponse, TokenUsage } from './types';
import TokenCounter from '../../utils/TokenCounter';
import Logger from '../../utils/Logger';
export interface PipelineContext {
promptText: string;
completionText: string;
finishReason: "stop" | "length" | "cancelled" | "error";
modelName: string;
executionTimeMs: number;
}
export class ResponsePipeline {
private stopSequences: string[] = ["</s>", "<|im_end|>", "<|endoftext|>"];
/**
Processes raw text output from an inference cycle, sanitizing and generating usage metrics.
*/
public process(context: PipelineContext): AIResponse {
Logger.info(Processing raw response pipeline execution for model: ${context.modelName});
// 1. Sanitize text by stripping trailing or leading whitespace and common token boundaries
const sanitizedText = this.sanitizeText(context.completionText);
// 2. Extrapolate and build exact usage metrics for tracking
const usage = this.calculateUsage(context.promptText, sanitizedText);
// 3. Frame structural production response object
const response: AIResponse = {
id: resp_${Date.now()}_${Math.random().toString(36).substring(2, 9)},
text: sanitizedText,
usage,
finishReason: context.finishReason,
};
Logger.debug(Response Pipeline processing completed. Total tokens: ${usage.total});
return response;
}
/**
Cleanses raw textual fragments from internal engine stop structures.
*/
private sanitizeText(rawText: string): string {
let cleanText = rawText;
for (const sequence of this.stopSequences) {
if (cleanText.endsWith(sequence)) {
cleanText = cleanText.slice(0, -sequence.length);
}
}
return cleanText.trim();
}
/**
Synthesizes prompt and completion vectors into a concrete TokenUsage breakdown.
*/
private calculateUsage(prompt: string, completion: string): TokenUsage {
return TokenCounter.buildUsage(prompt, completion);
}
/**
Extends the default stop sequence dictionary with runtime overrides.
*/
public registerStopSequences(sequences: string[]): void {
const uniqueSequences = new Set([...this.stopSequences, ...sequences]);
this.stopSequences = Array.from(uniqueSequences);
Logger.debug(Response Pipeline stop sequences synchronized. Current registry size: ${this.stopSequences.length});
}
}
export default new ResponsePipeline();
