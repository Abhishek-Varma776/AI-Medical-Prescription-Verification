import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FlaskConical, Scale, ArrowRightLeft, ScanText, User } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: <FlaskConical className="w-8 h-8 text-primary" />,
    title: "Drug Interaction Analysis",
    description: "Detect harmful interactions between multiple drugs for specific patient profiles.",
  },
  {
    icon: <Scale className="w-8 h-8 text-primary" />,
    title: "Age-Specific Dosage",
    description: "Receive accurate dosage recommendations based on age and renal function.",
  },
  {
    icon: <ArrowRightLeft className="w-8 h-8 text-primary" />,
    title: "Alternative Medications",
    description: "Get suggestions for safer drug alternatives when contraindications are found.",
  },
  {
    icon: <ScanText className="w-8 h-8 text-primary" />,
    title: "Information Extraction",
    description: "Extract structured drug details from unstructured medical notes.",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
            <div className="p-6 md:p-8 space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome to MediCheck AI</h1>
                <p className="text-muted-foreground text-lg">
                    Your AI-powered assistant for safer and more effective medication management.
                </p>
                <CardDescription>
                    Navigate through our tools using the sidebar to analyze drug interactions, get dosage recommendations, and more. Start by setting up a patient profile for personalized analysis.
                </CardDescription>
            </div>
            <div className="relative h-48 md:h-full">
                <Image
                    src="https://picsum.photos/800/400"
                    alt="Healthcare professional using a tablet"
                    data-ai-hint="healthcare professional"
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div>
        </div>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Core Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
