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
app.patch("/api/feedback/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await prisma.feedback.update({
      where: { id },
      data: { status: "done" },
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
