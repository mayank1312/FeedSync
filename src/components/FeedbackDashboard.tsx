import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FeedbackCard } from "@/components/FeedbackCard";
import { Search, Filter, Calendar } from "lucide-react";
import type { Feedback } from "@/pages/Index";

interface FeedbackDashboardProps {
  feedbacks: Feedback[];
  onDelete: (id: string) => void;
}

export const FeedbackDashboard = ({ feedbacks }: FeedbackDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [localFeedbacks, setLocalFeedbacks] = useState<Feedback[]>(feedbacks);

  const handleDelete = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:4000/api/feedback/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

   
    setLocalFeedbacks(prev => prev.filter(f => f.id !== id));

  
    localStorage.setItem("activeTab", "dashboard");
  } catch (err) {
    console.error("Failed to delete feedback:", err);
  }
};


  const filteredAndSortedFeedbacks = localFeedbacks
    .filter(feedback => {
      const matchesSearch = 
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (feedback.feedback || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || feedback.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
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
    return localFeedbacks.filter(f => f.category === category).length;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
          <div className="text-2xl font-bold text-blue-600">{localFeedbacks.length}</div>
          <div className="text-sm text-slate-600">Total Feedback</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
          <div className="text-2xl font-bold text-emerald-600">{getCategoryCount("suggestion")}</div>
          <div className="text-sm text-slate-600">Suggestions</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
          <div className="text-2xl font-bold text-amber-600">{getCategoryCount("bug-report")}</div>
          <div className="text-sm text-slate-600">Bug Reports</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
          <div className="text-2xl font-bold text-purple-600">{getCategoryCount("feature-request")}</div>
          <div className="text-sm text-slate-600">Feature Requests</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search feedback by name, email, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories ({getCategoryCount("all")})</SelectItem>
                <SelectItem value="suggestion">💡 Suggestions ({getCategoryCount("suggestion")})</SelectItem>
                <SelectItem value="bug-report">🐛 Bug Reports ({getCategoryCount("bug-report")})</SelectItem>
                <SelectItem value="feature-request">✨ Features ({getCategoryCount("feature-request")})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field as "date" | "name");
              setSortOrder(order as "asc" | "desc");
            }}>
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(searchTerm || categoryFilter !== "all") && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">
              Showing {filteredAndSortedFeedbacks.length} of {localFeedbacks.length} feedback items
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
              }}
              className="text-slate-500 hover:text-slate-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredAndSortedFeedbacks.length === 0 ? (
          <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200">
            <div className="text-slate-400 text-lg mb-2">No feedback found</div>
            <div className="text-slate-500 text-sm">
              {searchTerm || categoryFilter !== "all" 
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
                <FeedbackCard feedback={feedback} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
