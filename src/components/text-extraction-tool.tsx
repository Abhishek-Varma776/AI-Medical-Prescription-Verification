'use client';

import type { ExtractDrugInformationOutput } from '@/ai/flows/extract-drug-information';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getExtractedDrugInfo } from '@/app/actions';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const extractionSchema = z.object({
  medicalText: z.string().min(10, 'Please enter some medical text to analyze.'),
});

export default function TextExtractionTool() {
  const [result, setResult] = useState<ExtractDrugInformationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof extractionSchema>>({
    resolver: zodResolver(extractionSchema),
    defaultValues: { medicalText: '' },
  });

  async function onSubmit(values: z.infer<typeof extractionSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await getExtractedDrugInfo(values);

    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NLP-Based Drug Information Extraction</CardTitle>
          <CardDescription>
            Paste unstructured medical text (e.g., doctor's notes, patient records) to automatically extract drug names, dosages, and frequencies.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="medicalText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. 'Patient is prescribed 500mg of Amoxicillin twice daily for 7 days...'"
                        rows={8}
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
                Extract Information
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
         <Card>
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.length > 0 ? (
                  result.map((drug, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{drug.drugName}</TableCell>
                      <TableCell>{drug.dosage}</TableCell>
                      <TableCell>{drug.frequency}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No drug information found in the provided text.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
