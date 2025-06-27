const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post('/api/feedback', async (req, res) => {
  const { name, email, category, feedback } = req.body;

  try {
    const saved = await prisma.feedback.create({
      data: {
        name,
        email,
        category,
        message: feedback,
      },
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }, 
    });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});
app.delete("/api/feedback/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.feedback.delete({
      where: { id },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("DELETE /api/feedback/:id error:", err);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
