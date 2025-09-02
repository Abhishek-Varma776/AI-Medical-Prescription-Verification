'use client';

import type { PatientProfile } from '@/lib/types';
import type { DrugInteractionOutput } from '@/ai/flows/drug-interaction-analysis';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDrugInteractionReport } from '@/app/actions';
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
import { Loader2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const interactionSchema = z.object({
  drugList: z.string().min(1, 'Please enter at least one drug.'),
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

export default function DrugInteractionTool({ patientProfile }: { patientProfile: PatientProfile | null }) {
  const [result, setResult] = useState<DrugInteractionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof interactionSchema>>({
    resolver: zodResolver(interactionSchema),
    defaultValues: { drugList: '' },
  });

  async function onSubmit(values: z.infer<typeof interactionSchema>) {
    setIsLoading(true);
    setResult(null);

    const patientDetails = formatPatientDetails(patientProfile);

    const response = await getDrugInteractionReport({
      drugList: values.drugList,
      patientDetails,
    });

    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Drug Interaction Analysis</CardTitle>
          <CardDescription>
            Enter a list of drugs to check for potential harmful interactions. For more accurate results, please fill out the patient profile.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="drugList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drug List</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Aspirin, Lisinopril, Metformin"
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
                Analyze Interactions
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Interaction Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Interaction Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
                <p>{result.interactionReport}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
