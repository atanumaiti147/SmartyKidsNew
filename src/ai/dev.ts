'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-tip-from-wrong-answer.ts';
import '@/ai/flows/generate-tip-text.ts';
