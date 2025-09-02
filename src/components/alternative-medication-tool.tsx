'use client';

import type { PatientProfile } from '@/lib/types';
import type { AlternativeMedicationOutput } from '@/ai/flows/alternative-medication';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAlternativeMedication } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

const alternativeSchema = z.object({
  medications: z.string().min(1, 'Please enter at least one medication.'),
  interactionDetails: z.string().min(1, 'Please describe the interaction or issue.'),
});

function formatPatientDetails(profile: PatientProfile | null): string {
  if (!profile || Object.values(profile).every(v => v === undefined || v === '')) {
    return 'No patient details provided.';
  }
  const details = [];
  if (profile.age) details.push(`Age: ${profile.age}`);
  if (profile.sex) details.push(`Sex: ${profile.sex}`);
  if (profile.weight) details.push(`Weight: ${profile.weight} kg`);
  if (profile.renalFunction) details.push(`Renal Function: ${profile.renalFunction} impairment`);
  if (profile.otherConditions) details.push(`Other Conditions: ${profile.otherConditions}`);
  return details.length > 0 ? details.join(', ') : 'No patient details provided.';
}

export default function AlternativeMedicationTool({ patientProfile }: { patientProfile: PatientProfile | null }) {
  const [result, setResult] = useState<AlternativeMedicationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof alternativeSchema>>({
    resolver: zodResolver(alternativeSchema),
    defaultValues: { medications: '', interactionDetails: '' },
  });

  async function onSubmit(values: z.infer<typeof alternativeSchema>) {
    setIsLoading(true);
    setResult(null);

    const patientDetails = formatPatientDetails(patientProfile);

    const response = await getAlternativeMedication({
      patientProfile: patientDetails,
      medications: values.medications.split(',').map(s => s.trim()),
      interactionDetails: values.interactionDetails,
    });

    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alternative Medication Suggestions</CardTitle>
          <CardDescription>
            If a drug interaction or contraindication is found, use this tool to find safer alternatives based on the patient's profile.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Warfarin, Amiodarone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interactionDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interaction/Contraindication Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Warfarin and Amiodarone interaction increases bleeding risk."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Suggest Alternatives
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
         <Card>
          <CardHeader>
            <CardTitle>Suggested Alternatives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Alternatives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
              <h3 className="text-lg font-semibold mb-2">Medications</h3>
              <div className="flex flex-wrap gap-2">
                {result.suggestedAlternatives.map((alt, index) => (
                    <Badge key={index} variant="secondary" className="text-base px-3 py-1">{alt}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Lightbulb className="text-primary"/>Reasoning</h3>
              <p className="text-sm text-muted-foreground">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
