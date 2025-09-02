'use client';

import type { PatientProfile } from '@/lib/types';
import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  HeartPulse,
  LayoutDashboard,
  User,
  FlaskConical,
  Scale,
  ArrowRightLeft,
  ScanText,
} from 'lucide-react';

import Dashboard from '@/components/dashboard';
import PatientProfileForm from '@/components/patient-profile-form';
import DrugInteractionTool from '@/components/drug-interaction-tool';
import DosageRecommendationTool from '@/components/dosage-recommendation-tool';
import AlternativeMedicationTool from '@/components/alternative-medication-tool';
import TextExtractionTool from '@/components/text-extraction-tool';
import { Button } from '@/components/ui/button';

type Tool =
  | 'dashboard'
  | 'profile'
  | 'interaction'
  | 'dosage'
  | 'alternative'
  | 'extraction';

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool>('dashboard');
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(
    null
  );

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return (
          <PatientProfileForm
            profile={patientProfile}
            onSave={setPatientProfile}
          />
        );
      case 'interaction':
        return <DrugInteractionTool patientProfile={patientProfile} />;
      case 'dosage':
        return <DosageRecommendationTool patientProfile={patientProfile} />;
      case 'alternative':
        return <AlternativeMedicationTool patientProfile={patientProfile} />;
      case 'extraction':
        return <TextExtractionTool />;
      default:
        return <Dashboard />;
    }
  };

  const menuItems: { id: Tool; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Patient Profile', icon: User },
    { id: 'interaction', label: 'Drug Interaction', icon: FlaskConical },
    { id: 'dosage', label: 'Dosage Helper', icon: Scale },
    { id: 'alternative', label: 'Alternatives', icon: ArrowRightLeft },
    { id: 'extraction', label: 'Extract Info', icon: ScanText },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Button variant="ghost" className="flex items-center gap-2">
            <HeartPulse className="size-6 text-primary" />
            <h1 className="text-lg font-semibold">MediCheck AI</h1>
          </Button>
        </SidebarHeader>
        <SidebarMenu>
          {menuItems.map(({ id, label, icon: Icon }) => (
            <SidebarMenuItem key={id}>
              <SidebarMenuButton
                onClick={() => setActiveTool(id)}
                isActive={activeTool === id}
              >
                <Icon />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter>
          <div className="text-xs text-muted-foreground p-2">
            &copy; 2024 MediCheck AI. All rights reserved.
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 md:p-6">{renderTool()}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
