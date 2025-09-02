import { config } from 'dotenv';
config();

import '@/ai/flows/drug-interaction-analysis.ts';
import '@/ai/flows/extract-drug-information.ts';
import '@/ai/flows/alternative-medication.ts';
import '@/ai/flows/age-specific-dosage.ts';