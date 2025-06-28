import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Feedback } from "@/pages/Index";
import { exportFeedbackAsPdf } from "@/utils/exportFeedbackPdf";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface FeedbackCardProps {
  feedback: Feedback;
  onResolve: (id: string) => void;
  resolving?: boolean;
}

export const FeedbackCard = ({ feedback, onResolve, resolving }: FeedbackCardProps) => {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "suggestion":
        return {
          label: "💡 Suggestion",
          className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-200/10 dark:text-emerald-300",
        };
      case "bug-report":
        return {
          label: "🐛 Bug Report",
          className: "bg-amber-100 text-amber-800 dark:bg-amber-200/10 dark:text-amber-300",
        };
      case "feature-request":
        return {
          label: "✨ Feature Request",
          className: "bg-purple-100 text-purple-800 dark:bg-purple-200/10 dark:text-purple-300",
        };
      default:
        return {
          label: category,
          className: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-white",
        };
    }
  };

  const categoryConfig = getCategoryConfig(feedback.category);

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500 group">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {feedback.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {feedback.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{feedback.email}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-slate-800 border dark:border-slate-700">
            <DropdownMenuItem
              disabled={feedback.status === "done" || resolving}
              onClick={() => onResolve(feedback.id)}
              className="flex items-center gap-2"
            >
              {resolving ? (
                <>
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Resolving...
                </>
              ) : (
                "✅ Mark as Resolved"
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
             onClick={() => exportFeedbackAsPdf(feedback)}
             className="flex items-center gap-2"
             >
              📄 Download PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={`${categoryConfig.className}`}>
            {categoryConfig.label}
          </Badge>
          <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {formatDistanceToNow(new Date(feedback.date), { addSuffix: true })}
          </span>
          <span
            className={`text-xs ml-auto px-2 py-1 rounded-full ${
              feedback.status === "done"
                ? "bg-green-100 text-green-700 dark:bg-green-200/10 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-200/10 dark:text-yellow-400"
            }`}
          >
            {feedback.status === "done" ? "Resolved" : "Pending"}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-400">
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{feedback.feedback}</p>
        </div>
      </CardContent>
    </Card>
  );
};
