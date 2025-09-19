# MediCheck AI - Medical Prescription Verification System

An AI-powered medical prescription verification system built with Next.js and Google's Genkit framework. This application helps healthcare professionals analyze drug interactions, recommend appropriate dosages, and suggest alternative medications based on patient profiles.

## 🚀 Features

### Core Functionality
- **Drug Interaction Analysis** - Detect harmful interactions between multiple drugs for specific patient profiles
- **Age-Specific Dosage Recommendations** - Get accurate dosage recommendations based on age, renal function, and other conditions
- **Alternative Medication Suggestions** - Find safer drug alternatives when contraindications are detected
- **Information Extraction** - Extract structured drug details from unstructured medical notes
- **Patient Profile Management** - Store and manage patient information for personalized analysis

### Technical Features
- Modern React/Next.js frontend with TypeScript
- AI-powered analysis using Google's Gemini 2.5 Flash model
- Responsive design with Tailwind CSS
- Component-based UI with Radix UI primitives
- Real-time form validation with React Hook Form and Zod

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **AI Framework**: Google Genkit with Gemini 2.5 Flash
- **Styling**: Tailwind CSS, Radix UI components
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Development**: Turbopack for fast development

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API key

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-Medical-Prescription-Verification-main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

### 4. Run the Development Server
```bash
# Start the Next.js development server
npm run dev

# In a separate terminal, start the Genkit AI server
npm run genkit:dev
```

The application will be available at `http://localhost:9002`

## 📁 Project Structure

```
src/
├── ai/                          # AI flows and configuration
│   ├── flows/                   # Individual AI analysis flows
│   │   ├── age-specific-dosage.ts
│   │   ├── alternative-medication.ts
│   │   ├── drug-interaction-analysis.ts
│   │   └── extract-drug-information.ts
│   ├── dev.ts                   # Development AI server
│   └── genkit.ts               # Genkit configuration
├── app/                         # Next.js app directory
│   ├── actions.ts              # Server actions
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page component
├── components/                  # React components
│   ├── ui/                     # Reusable UI components
│   ├── dashboard.tsx           # Main dashboard
│   ├── patient-profile-form.tsx
│   ├── drug-interaction-tool.tsx
│   ├── dosage-recommendation-tool.tsx
│   ├── alternative-medication-tool.tsx
│   └── text-extraction-tool.tsx
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions and types
│   ├── types.ts               # TypeScript type definitions
│   └── utils.ts               # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start Next.js development server with Turbopack
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with file watching
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🤖 AI Features

### Drug Interaction Analysis
Analyzes potential harmful interactions between multiple drugs considering:
- Patient age, sex, and weight
- Renal function status
- Existing medical conditions
- Drug-specific contraindications

### Dosage Recommendations
Provides age-specific dosage recommendations based on:
- Patient demographics
- Renal function assessment
- Drug safety profiles
- Clinical guidelines

### Alternative Medications
Suggests safer alternatives when:
- Drug interactions are detected
- Contraindications exist
- Patient-specific factors require alternatives

### Information Extraction
Extracts structured information from:
- Unstructured medical notes
- Prescription text
- Patient records

## 🎯 Usage

1. **Set Up Patient Profile**: Navigate to the Patient Profile section to enter patient demographics and medical history
2. **Analyze Drug Interactions**: Use the Drug Interaction tool to check for harmful interactions between medications
3. **Get Dosage Recommendations**: Use the Dosage Helper to get age and condition-specific dosage recommendations
4. **Find Alternatives**: Use the Alternatives tool to find safer medication options
5. **Extract Information**: Use the Extract Info tool to process unstructured medical text

## 🔒 Security & Privacy

- Patient data is processed locally and not stored permanently
- AI analysis is performed using Google's secure API endpoints
- No patient information is logged or retained by the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for educational and research purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**MediCheck AI** - Making medication management safer and more effective through AI technology.
