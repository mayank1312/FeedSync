import { useState, useEffect } from "react";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FeedbackDashboard } from "@/components/FeedbackDashboard";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Feedback {
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
      }));

      setFeedbacks(parsed);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };
  useEffect(() => {
  const storedTab = localStorage.getItem("activeTab");
  if (storedTab) {
    setActiveTab(storedTab);
    localStorage.removeItem("activeTab"); // clean up after use
  }
}, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-20 ">
        <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab}
              onValueChange={(val) => 
          {
            setActiveTab(val);
            localStorage.setItem("activeTab", val); 
          }}
            className="w-full"
        >


            <TabsList className="flex justify-center gap-4 mb-8 bg-white p-1 rounded-xl shadow-md w-fit mx-auto">
              <TabsTrigger
                value="submit"
                className="px-6 py-2 rounded-lg font-medium text-slate-600  hover:text-blue-600 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200"
              >
                Submit Feedback
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="px-6 py-2 rounded-lg font-medium text-slate-600  hover:text-blue-600 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200"
              >
                View Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="animate-fade-in">
              <FeedbackForm onSubmit={handleSubmitFeedback} />
            </TabsContent>

            <TabsContent value="dashboard" className="animate-fade-in">
              <FeedbackDashboard feedbacks={feedbacks} onDelete={handleDeleteFeedback}/>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
