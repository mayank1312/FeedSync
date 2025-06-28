import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FeedbackCard } from "@/components/FeedbackCard";
import { Search, Filter, Calendar } from "lucide-react";
import type { Feedback } from "@/pages/Index";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface FeedbackDashboardProps {
  feedbacks: Feedback[];
}

export const FeedbackDashboard = ({ feedbacks }: FeedbackDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterDate, setFilterDate] = useState<string>("");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [localFeedbacks, setLocalFeedbacks] = useState<Feedback[]>(feedbacks);

  const handleResolve = async (id: string) => {
    const feedback = localFeedbacks.find((f) => f.id === id);
    if (!feedback || feedback.status === "done") return;

    const toastId = toast.loading("Marking as resolved...");
    setResolvingId(id);

    try {
      const res = await fetch(`http://localhost:4000/api/feedback/${id}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed to update");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLocalFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "done" } : f))
      );

      toast.success("Marked as resolved", {
        id: toastId,
        description: "This feedback has been updated successfully.",
      });
    } catch (err) {
      toast.error("Resolve failed", {
        id: toastId,
        description: "Something went wrong, try again.",
      });
    } finally {
      setResolvingId(null);
    }
  };

  const filteredAndSortedFeedbacks = localFeedbacks
    .filter((feedback) => {
      const matchesSearch =
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (feedback.feedback || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || feedback.category === categoryFilter;

      const feedbackDate = new Date(feedback.date).toISOString().split("T")[0];
      const matchesDate = filterDate ? feedbackDate === filterDate : true;

      return matchesSearch && matchesCategory && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === "desc" ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
      }
    });

  const getCategoryCount = (category: string) => {
    if (category === "all") return localFeedbacks.length;
    return localFeedbacks.filter((f) => f.category === category).length;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatBox title="Total Feedback" value={localFeedbacks.length} color="blue" />
        <StatBox title="Suggestions" value={getCategoryCount("suggestion")} color="emerald" />
        <StatBox title="Bug Reports" value={getCategoryCount("bug-report")} color="amber" />
        <StatBox title="Feature Requests" value={getCategoryCount("feature-request")} color="purple" />
      </div>

      {/* Filters */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-lg p-6 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-end md:flex-wrap">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search feedback by name, email, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          {/* Category */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48 h-10">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories ({getCategoryCount("all")})</SelectItem>
              <SelectItem value="suggestion">💡 Suggestions ({getCategoryCount("suggestion")})</SelectItem>
              <SelectItem value="bug-report">🐛 Bug Reports ({getCategoryCount("bug-report")})</SelectItem>
              <SelectItem value="feature-request">✨ Features ({getCategoryCount("feature-request")})</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split("-");
              setSortBy(field as "date" | "name");
              setSortOrder(order as "asc" | "desc");
            }}
          >
            <SelectTrigger className="w-48 h-10">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <div className="flex flex-col gap-1">
            <Label className="text-slate-600 dark:text-slate-300 text-sm font-medium">Filter by Date</Label>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="h-10 w-48"
            />
          </div>

          {filterDate && (
            <Button
              variant="outline"
              onClick={() => setFilterDate("")}
              className="h-10 mt-6 text-sm"
            >
              Clear Date
            </Button>
          )}
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredAndSortedFeedbacks.length === 0 ? (
          <div className="text-center py-12 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400 text-lg mb-2">No feedback found</div>
            <div className="text-slate-500 dark:text-slate-400 text-sm">
              {searchTerm || categoryFilter !== "all" || filterDate
                ? "Try adjusting your search criteria or filters"
                : "No feedback has been submitted yet"}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedFeedbacks.map((feedback, index) => (
              <div
                key={feedback.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <FeedbackCard
                  feedback={feedback}
                  onResolve={handleResolve}
                  resolving={resolvingId === feedback.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Stat Box Component
const StatBox = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "blue" | "emerald" | "amber" | "purple";
}) => {
  const colorMap = {
    blue: "text-blue-600 dark:text-blue-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    purple: "text-purple-600 dark:text-purple-400",
  };
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200 dark:border-slate-700">
      <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-sm text-slate-600 dark:text-slate-400">{title}</div>
    </div>
  );
};
