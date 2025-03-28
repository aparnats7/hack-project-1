import express from 'express';
import Verification from '../models/Verification.js';
import Document from '../models/Document.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new verification (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { documentId, status, comments } = req.body;

    // Check if document exists
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Create verification
    const verification = await Verification.create({
      documentId,
      verifiedBy: req.user._id,
      status,
      comments,
    });

    // Update document status
    await Document.findByIdAndUpdate(documentId, {
      status,
      updatedAt: Date.now(),
    });

    res.status(201).json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get verifications for a document (Protected)
router.get('/document/:documentId', protect, async (req, res) => {
  try {
    // Check if user owns document or is admin
    const document = await Document.findById(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these verifications' });
    }

    const verifications = await Verification.find({ documentId: req.params.documentId })
      .populate('verifiedBy', 'name email')
      .sort({ verificationDate: -1 });
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get verifications by verifier (Admin only)
router.get('/verifier/:verifierId', protect, admin, async (req, res) => {
  try {
    const verifications = await Verification.find({ verifiedBy: req.params.verifierId })
      .populate('documentId')
      .sort({ verificationDate: -1 });
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
