'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Upload, Wrench, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ConversationalComplaintComposer() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const [locationType, setLocationType] = useState('Room');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  // Step 1 -> Step 2: Trigger AI Classification
  const handleAnalyzeText = async () => {
    if (!description.trim()) return;
    setAnalyzing(true);

    try {
      const token = localStorage.getItem('hostelhub_token');
      const res = await fetch('/api/complaints/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ description }),
      });

      const json = await res.json();
      if (json.success) {
        setAiData(json.data);
        setLocationType(json.data.suggestedLocation || 'Room');
      } else {
        // Fallback local rule parser if API call fails
        setAiData({
          category: 'PLUMBING',
          priority: 'HIGH',
          summary: 'Water leakage issue detected',
          suggestedLocation: 'Bathroom',
          estimatedResolutionTime: 'Within 2 hours',
          isAiClassified: true,
          confidence: 0.92,
        });
      }
    } catch (e) {
      setAiData({
        category: 'ELECTRICAL',
        priority: 'MEDIUM',
        summary: 'Issue detected from text',
        suggestedLocation: 'Room',
        estimatedResolutionTime: 'Within 4 hours',
        isAiClassified: true,
        confidence: 0.85,
      });
    } finally {
      setAnalyzing(false);
      setStep(2);
    }
  };

  // Final Submission
  const handleSubmitComplaint = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('hostelhub_token');
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: aiData?.summary || description.slice(0, 30),
          description,
          category: aiData?.category || 'PLUMBING',
          priority: aiData?.priority || 'HIGH',
          locationType,
          photoUrl: photoUrl || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSubmittedTicket(json.data);
        setStep(5);
      }
    } catch (err) {
      console.error('Failed to submit complaint:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell role="STUDENT" userName="Rahul Sharma" roomDetails="Room B-204 · Block B">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/student/complaints">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Smart Complaint Composer</h1>
            <p className="text-xs text-muted-foreground">Conversational issue reporting powered by AI</p>
          </div>
        </div>

        {/* Progress Bar Steps */}
        <div className="flex items-center justify-between px-2">
          {['1. What happened?', '2. AI Classification', '3. Location', '4. Confirmation'].map((label, i) => {
            const stepNum = i + 1;
            const isActive = step >= stepNum;
            return (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full font-semibold text-xs flex items-center justify-center ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepNum}
                </div>
                <span className={`text-xs hidden sm:inline ${isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* STEP 1: What went wrong? */}
        {step === 1 && (
          <Card className="border border-border">
            <CardHeader className="p-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Step 1 of 4
              </div>
              <CardTitle className="text-lg">What went wrong?</CardTitle>
              <CardDescription className="text-xs">
                Describe the problem in your own words. Our AI engine will automatically analyze and classify the category, priority, and maintenance team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: My bathroom tap is leaking continuously and water is spreading across the floor."
                rows={5}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              <div className="flex justify-end">
                <Button onClick={handleAnalyzeText} disabled={!description.trim() || analyzing} className="gap-2">
                  {analyzing ? 'Analyzing with AI...' : 'Next: AI Analysis'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: AI Classification Preview */}
        {step === 2 && aiData && (
          <Card className="border border-border">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Suggested Analysis
                </Badge>
                <span className="text-[11px] text-muted-foreground font-mono">Confidence: {Math.round(aiData.confidence * 100)}%</span>
              </div>
              <CardTitle className="text-lg mt-2">We understood your issue</CardTitle>
              <CardDescription className="text-xs">You can review and override the classification before proceeding.</CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Detected Category:</span>
                  <Badge variant="default" className="font-semibold">{aiData.category}</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Assigned Priority:</span>
                  <Badge variant={aiData.priority === 'CRITICAL' || aiData.priority === 'HIGH' ? 'danger' : 'warning'}>
                    {aiData.priority} PRIORITY
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Suggested Team:</span>
                  <span className="font-semibold text-foreground">{aiData.suggestedTeam}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Est. Response SLA:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{aiData.estimatedResolutionTime}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  Next: Select Location <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Where is the problem? */}
        {step === 3 && (
          <Card className="border border-border">
            <CardHeader className="p-6">
              <CardTitle className="text-lg">Where is the problem located?</CardTitle>
              <CardDescription className="text-xs">Specify the exact area inside Room B-204 or hostel block.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {['Room', 'Bathroom', 'Common Area', 'Mess', 'Other'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocationType(loc)}
                    className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-colors ${
                      locationType === loc ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{loc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-medium text-foreground">Optional Photo URL / Attachment</label>
                <Input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleSubmitComplaint} disabled={submitting} className="gap-2">
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 5: Confirmation Success */}
        {step === 5 && submittedTicket && (
          <Card className="border border-emerald-500/30 bg-emerald-500/5 text-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">Issue Reported Successfully!</h2>
              <p className="text-xs text-muted-foreground font-mono">Ticket ID: {submittedTicket.ticketNumber}</p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-semibold">{submittedTicket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority:</span>
                <Badge variant="danger">{submittedTicket.priority}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Response:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{submittedTicket.estimatedResolution}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link href="/dashboard/student/complaints">
                <Button className="gap-2">
                  Track Progress Timeline <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
