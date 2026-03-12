'use server';
/**
 * @fileOverview Generates a helpful tip for a question.
 *
 * - generateTipText - A function that generates the tip text.
 * - GenerateTipTextInput - The input type for the generateTipText function.
 * - GenerateTipTextOutput - The return type for the generateTipText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTipTextInputSchema = z.object({
  question: z.string().describe('The question that was asked.'),
  answer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic of the question (e.g., alphabets, numbers, colors).'),
});
export type GenerateTipTextInput = z.infer<typeof GenerateTipTextInputSchema>;

const GenerateTipTextOutputSchema = z.object({
  tip: z.string().describe('A helpful tip or explanation for the question.'),
});
export type GenerateTipTextOutput = z.infer<typeof GenerateTipTextOutputSchema>;

export async function generateTipText(input: GenerateTipTextInput): Promise<GenerateTipTextOutput> {
  return generateTipTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTipTextPrompt',
  input: {schema: GenerateTipTextInputSchema},
  output: {schema: GenerateTipTextOutputSchema},
  prompt: `You are a friendly and helpful tutor for nursery-aged children (3-6 years old). Provide a simple and easy-to-understand tip to help the student understand the concept and answer the question correctly. The tip should be similar to the explanations provided on Brainly, but tailored for young children.\n\nHere is the context:\n\nTopic: {{{topic}}}\nQuestion: {{{question}}}\nCorrect Answer: {{{answer}}}\n\nTip:`,
});

const generateTipTextFlow = ai.defineFlow(
  {
    name: 'generateTipTextFlow',
    inputSchema: GenerateTipTextInputSchema,
    outputSchema: GenerateTipTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
