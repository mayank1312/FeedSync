
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";


interface FeedbackFormProps {
  onSubmit: () => Promise<void>; 
}


export const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "" as "suggestion" | "bug-report" | "feature-request" | "",
    feedback: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = "Feedback is required";
    } else if (formData.feedback.trim().length < 10) {
      newErrors.feedback = "Feedback must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:4000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Failed to submit");

  
    await onSubmit();

    toast({
      title: "Feedback Submitted Successfully!",
      description: "Thank you for your feedback. We'll review it shortly.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      category: "",
      feedback: "",
    });
  } catch {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  }

  setIsSubmitting(false);
};


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-slate-800">Share Your Feedback</CardTitle>
        <CardDescription className="text-slate-600">
          Help us improve by sharing your thoughts, reporting bugs, or suggesting new features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Your Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={`transition-all duration-200 ${
                  errors.name ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 animate-fade-in">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className={`transition-all duration-200 ${
                  errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 animate-fade-in">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className={`transition-all duration-200 ${
                errors.category ? "border-red-500" : "focus:border-blue-500"
              }`}>
                <SelectValue placeholder="Select feedback category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggestion">💡 Suggestion</SelectItem>
                <SelectItem value="bug-report">🐛 Bug Report</SelectItem>
                <SelectItem value="feature-request">✨ Feature Request</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 animate-fade-in">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-slate-700 font-medium">
              Your Feedback *
            </Label>
            <Textarea
              id="feedback"
              value={formData.feedback}
              onChange={(e) => handleInputChange("feedback", e.target.value)}
              placeholder="Please share your detailed feedback here..."
              rows={5}
              className={`transition-all duration-200 resize-none ${
                errors.feedback ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
              }`}
            />
            <div className="flex justify-between items-center">
              {errors.feedback && (
                <p className="text-sm text-red-500 animate-fade-in">{errors.feedback}</p>
              )}
              <p className="text-sm text-slate-500 ml-auto">
                {formData.feedback.length}/500 characters
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Submit Feedback</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
