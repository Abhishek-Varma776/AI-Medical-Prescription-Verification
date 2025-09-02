'use client';

import type { PatientProfile } from '@/lib/types';
import type { AgeSpecificDosageOutput } from '@/ai/flows/age-specific-dosage';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDosageRecommendation } from '@/app/actions';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const dosageSchema = z.object({
  drugName: z.string().min(1, 'Drug name is required.'),
  patientAge: z.coerce.number().int().positive('Age must be a positive number.'),
  renalFunction: z.enum(['normal', 'mild', 'moderate', 'severe']),
  otherConditions: z.string().optional(),
});

export default function DosageRecommendationTool({ patientProfile }: { patientProfile: PatientProfile | null }) {
  const [result, setResult] = useState<AgeSpecificDosageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof dosageSchema>>({
    resolver: zodResolver(dosageSchema),
    defaultValues: {
      drugName: '',
      patientAge: patientProfile?.age || undefined,
      renalFunction: patientProfile?.renalFunction || 'normal',
      otherConditions: patientProfile?.otherConditions || '',
    },
  });

  useEffect(() => {
    form.reset({
      drugName: '',
      patientAge: patientProfile?.age || undefined,
      renalFunction: patientProfile?.renalFunction || 'normal',
      otherConditions: patientProfile?.otherConditions || '',
    });
  }, [patientProfile, form]);

  async function onSubmit(values: z.infer<typeof dosageSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await getDosageRecommendation(values);
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Recommendation Failed',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Age-Specific Dosage Recommendation</CardTitle>
          <CardDescription>
            Get AI-powered dosage recommendations based on patient demographics. Uses patient profile data if available.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="drugName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drug Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Amoxicillin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patientAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="renalFunction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Renal Function</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select renal function status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="mild">Mild Impairment</SelectItem>
                          <SelectItem value="moderate">Moderate Impairment</SelectItem>
                          <SelectItem value="severe">Severe Impairment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="otherConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Conditions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. Liver disease" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendation
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Dosage Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Dosage Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Recommended Dosage</h3>
              <p className="text-2xl font-bold text-primary">{result.recommendedDosage}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Justification</h3>
              <p className="text-sm text-muted-foreground">{result.dosageJustification}</p>
            </div>
            {result.renalDosingGuidance && (
               <div>
                <h3 className="text-lg font-semibold">Renal Dosing Guidance</h3>
                <p className="text-sm text-muted-foreground">{result.renalDosingGuidance}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
