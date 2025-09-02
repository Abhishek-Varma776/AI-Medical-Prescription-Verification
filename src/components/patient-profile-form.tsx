'use client';

import type { PatientProfile } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

const profileSchema = z.object({
  age: z.coerce.number().int().positive().optional(),
  sex: z.enum(['male', 'female', 'other']).optional(),
  weight: z.coerce.number().positive().optional(),
  renalFunction: z.enum(['normal', 'mild', 'moderate', 'severe']).optional(),
  otherConditions: z.string().optional(),
});

type PatientProfileFormProps = {
  profile: PatientProfile | null;
  onSave: (profile: PatientProfile) => void;
};

export default function PatientProfileForm({ profile, onSave }: PatientProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: profile?.age,
      sex: profile?.sex,
      weight: profile?.weight,
      renalFunction: profile?.renalFunction,
      otherConditions: profile?.otherConditions,
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    onSave(values);
    toast({
      title: 'Profile Saved',
      description: 'Patient profile has been updated for this session.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Profile</CardTitle>
        <CardDescription>
          Enter patient details for more accurate AI analysis. This information is only stored for your current session.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 65" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 70" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient's sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Other Conditions / Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. History of hypertension, allergy to penicillin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">
              <Save />
              Save Profile
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
