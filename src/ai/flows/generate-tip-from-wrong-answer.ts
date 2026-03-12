'use server';
/**
 * @fileOverview Generates a helpful tip or explanation for a question answered incorrectly.
 *
 * - generateTipFromWrongAnswer - A function that generates the tip.
 * - GenerateTipFromWrongAnswerInput - The input type for the generateTipFromWrongAnswer function.
 * - GenerateTipFromWrongAnswerOutput - The return type for the generateTipFromWrongAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTipFromWrongAnswerInputSchema = z.object({
  question: z.string().describe('The question that was answered incorrectly.'),
  answer: z.string().describe('The correct answer to the question.'),
  studentAnswer: z.string().describe('The student\u2019s incorrect answer.'),
  topic: z.string().describe('The topic of the question (e.g., alphabets, numbers, colors).'),
});
export type GenerateTipFromWrongAnswerInput = z.infer<
  typeof GenerateTipFromWrongAnswerInputSchema
>;

const GenerateTipFromWrongAnswerOutputSchema = z.object({
  tip: z.string().describe('A helpful tip or explanation for the question.'),
});
export type GenerateTipFromWrongAnswerOutput = z.infer<
  typeof GenerateTipFromWrongAnswerOutputSchema
>;

export async function generateTipFromWrongAnswer(
  input: GenerateTipFromWrongAnswerInput
): Promise<GenerateTipFromWrongAnswerOutput> {
  return generateTipFromWrongAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTipFromWrongAnswerPrompt',
  input: {schema: GenerateTipFromWrongAnswerInputSchema},
  output: {schema: GenerateTipFromWrongAnswerOutputSchema},
  prompt: `You are a friendly and helpful tutor for nursery-aged children (3-6 years old). You are helping a student who has answered a question incorrectly twice. Provide a simple and easy-to-understand tip or explanation to help the student understand the concept and answer the question correctly. The tip should be similar to the explanations provided on Brainly, but tailored for young children.

Here is the context:

Topic: {{{topic}}}
Question: {{{question}}}
Correct Answer: {{{answer}}}
Student's Incorrect Answer: {{{studentAnswer}}}

Tip:`,
});

const generateTipFromWrongAnswerFlow = ai.defineFlow(
  {
    name: 'generateTipFromWrongAnswerFlow',
    inputSchema: GenerateTipFromWrongAnswerInputSchema,
    outputSchema: GenerateTipFromWrongAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
