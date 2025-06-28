import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Feedback } from "@/pages/Index";

export const exportFeedbackAsPdf = (feedback: Feedback) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor("#1E3A8A");
  doc.text("Feedback Report", 14, 22);

  doc.setFontSize(12);
  doc.setTextColor("#000000");

  // Define rows
  const rows = [
    ["Name", feedback.name],
    ["Email", feedback.email],
    ["Category", feedback.category],
    ["Status", feedback.status === "done" ? "Resolved" : "Pending"],
    ["Submitted On", new Date(feedback.date).toLocaleString()],
    ["Feedback", feedback.feedback],
  ];

  // Table
  autoTable(doc, {
    startY: 30,
    head: [["Field", "Value"]],
    body: rows,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246] }, // Blue
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // Save file
  const filename = `Feedback_${feedback.name}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};
