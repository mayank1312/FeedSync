import { useState, useEffect } from "react";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FeedbackDashboard } from "@/components/FeedbackDashboard";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/Footer";
export interface Feedback {
  status: string;
  id: string;
  name: string;
  email: string;
  category: string;
  feedback: string;
  date: Date;
}

const Index = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState("submit");

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/feedback");
      const data = await res.json();
      console.log("Fetched feedbacks:", data);

      const parsed: Feedback[] = data.map((item: any) => ({
  id: item.id,
  name: item.name,
  email: item.email,
  category: item.category,
  feedback: item.message,
  date: new Date(item.createdAt),
  status: item.status,  
}));

      setFeedbacks(parsed);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };
 

  useEffect(() => {
    fetchFeedbacks();
  }, []);

 const handleSubmitFeedback = async () => {
  await fetchFeedbacks();


};

 const handleDeleteFeedback = async (id: string) => {
  try {
    await fetch(`http://localhost:4000/api/feedback/${id}`, {
      method: "DELETE",
    });

    await fetchFeedbacks(); 
    setActiveTab("dashboard");
    localStorage.setItem("activeTab", "dashboard");
  } catch (err) {
    console.error("Error deleting feedback:", err);
  }
};



return (
  <div className="flex flex-col min-h-screen transition-colors duration-300 bg-white text-slate-800 dark:bg-slate-900 dark:text-white">
    <Header />
    
    <main className="flex-1 container mx-auto px-4 py-8 mt-20">
      <div className="max-w-6xl mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            if (value === "dashboard") {
              fetchFeedbacks();
            }
          }}
        >
          <TabsList className="flex justify-center gap-4 mb-8 bg-slate-100/70 dark:bg-slate-800/70 p-1 rounded-xl shadow-md w-fit mx-auto">
            <TabsTrigger
              value="submit"
              className="px-6 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200"
            >
              Submit Feedback
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="px-6 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200"
            >
              View Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="animate-fade-in">
            <FeedbackForm onSubmit={handleSubmitFeedback} />
          </TabsContent>

          <TabsContent key={activeTab === "dashboard" ? Date.now() : undefined} value="dashboard" className="animate-fade-in">
            <FeedbackDashboard feedbacks={feedbacks} />
          </TabsContent>
        </Tabs>
      </div>
    </main>

    <Footer />
  </div>
);

};

export default Index;
