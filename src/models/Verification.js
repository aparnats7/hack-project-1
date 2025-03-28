import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  verificationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['verified', 'rejected'],
    required: true,
  },
  comments: {
    type: String,
  },
});

const Verification = mongoose.model('Verification', verificationSchema);
export default Verification;
