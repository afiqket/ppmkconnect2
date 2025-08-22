import React from 'react';
import { X, Check, XIcon } from 'lucide-react';
import { Application } from '../../types';

interface ApplicationModalProps {
  application: Application;
  onClose: () => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ 
  application, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(application.id);
      onClose();
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(application.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Application Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
            {onApprove && onReject && application.status === 'pending' && (
              <div className="flex space-x-3">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <XIcon className="h-4 w-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Name</h3>
              <p className="text-gray-900">{application.fullName}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Email</h3>
              <p className="text-gray-900">{application.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Phone</h3>
              <p className="text-gray-900">{application.phone}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Student ID</h3>
              <p className="text-gray-900">{application.studentId}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Course</h3>
              <p className="text-gray-900">{application.course}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Year</h3>
              <p className="text-gray-900">Year {application.year}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Motivation</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900">{application.motivation}</p>
            </div>
          </div>

          {application.experience && (
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Experience</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">{application.experience}</p>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Contribution</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900">{application.contribution}</p>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>Submitted: {new Date(application.submittedAt).toLocaleDateString('en-MY', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
