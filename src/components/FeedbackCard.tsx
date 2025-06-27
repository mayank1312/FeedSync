import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import type { Feedback } from "@/pages/Index";

interface FeedbackCardProps {
  feedback: Feedback;
  onDelete: (id: string) => void;
}

export const FeedbackCard = ({ feedback, onDelete }: FeedbackCardProps) => {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "suggestion":
        return {
          label: "💡 Suggestion",
          className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        };
      case "bug-report":
        return {
          label: "🐛 Bug Report",
          className: "bg-amber-100 text-amber-800 hover:bg-amber-200",
        };
      case "feature-request":
        return {
          label: "✨ Feature Request",
          className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        };
      default:
        return {
          label: category,
          className: "bg-slate-100 text-slate-800 hover:bg-slate-200",
        };
    }
  };

  const categoryConfig = getCategoryConfig(feedback.category);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {feedback.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                {feedback.name}
              </h3>
              <p className="text-sm text-slate-500">{feedback.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${categoryConfig.className} transition-colors duration-200`}>
              {categoryConfig.label}
            </Badge>
            <span className="text-sm text-slate-500 whitespace-nowrap">
              {formatDistanceToNow(new Date(feedback.date), { addSuffix: true })}
            </span>
            <button
              onClick={() => onDelete(feedback.id)}
              className="text-red-500 hover:text-red-700"
              title="Delete feedback"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-slate-700 leading-relaxed">{feedback.feedback}</p>
        </div>
      </CardContent>
    </Card>
  );
};
