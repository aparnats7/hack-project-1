import { CheckCircle, Clock, AlertCircle, Shield, FileText } from 'lucide-react';

const VerificationStatus = ({ status, progress, lastUpdated }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'rejected':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6" />;
      case 'pending':
        return <Clock className="w-6 h-6" />;
      case 'rejected':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'approved':
        return 'Your document has been verified successfully';
      case 'pending':
        return 'Your document is being processed';
      case 'rejected':
        return 'Your document needs to be resubmitted';
      default:
        return 'Verification status unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className={`p-6 rounded-lg ${getStatusColor(status)}`}>
        <div className="flex items-center gap-4">
          {getStatusIcon(status)}
          <div>
            <h3 className="text-lg font-semibold">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h3>
            <p className="text-sm opacity-90">{getStatusMessage(status)}</p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Verification Progress
          </h4>
          <span className="text-sm text-gray-500">
            {lastUpdated ? `Last updated: ${lastUpdated}` : ''}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${progress >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Document Upload</p>
              <p className="text-xs text-gray-500">Upload your identity document</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${progress >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">AI Processing</p>
              <p className="text-xs text-gray-500">Document analysis and verification</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${progress >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Verification Complete</p>
              <p className="text-xs text-gray-500">Final status and approval</p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Shield className="w-4 h-4" />
          <span>Your document is being processed with enterprise-grade security</span>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus; 