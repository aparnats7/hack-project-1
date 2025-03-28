import express from 'express';
import Document from '../models/Document.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload new document (Protected)
router.post('/upload', protect, async (req, res) => {
  try {
    const { title, description, hash } = req.body;
    
    const document = await Document.create({
      title,
      description,
      userId: req.user._id,
      hash,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all documents (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get document by ID (Protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns document or is admin
    if (document.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this document' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update document status (Admin only)
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's documents (Protected)
router.get('/user/me', protect, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
