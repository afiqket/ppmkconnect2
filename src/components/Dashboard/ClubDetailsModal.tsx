import React from 'react';
import { Club } from '../../types';
import { X, Users, Calendar, Award, MapPin, Star, Clock, CheckCircle } from 'lucide-react';

interface ClubDetailsModalProps {
  club: Club;
  onClose: () => void;
}

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({ club, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img
            src={club.image}
            alt={club.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-800">{club.category}</span>
          </div>
        </div>

        <div className="p-6">
          {/* Title and Basic Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-3xl font-bold text-gray-900">{club.name}</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
                <span className="text-sm text-gray-500">(24 reviews)</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-4">{club.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{club.memberCount}</div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{club.establishedYear}</div>
                <div className="text-sm text-gray-600">Established</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">Awards</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">4.2</div>
                <div className="text-sm text-gray-600">Years Avg</div>
              </div>
            </div>
          </div>

          {/* Leadership */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Leadership</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{club.hicomName.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{club.hicomName}</h4>
                  <p className="text-sm text-gray-600">High Committee (HiCom)</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600">Verified Leader</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Activities & Programs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {club.activities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Membership Requirements</h3>
            <div className="space-y-2">
              {club.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Schedule */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Meeting Schedule</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Weekly Meetings</span>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Every Wednesday, 7:00 PM - 9:00 PM</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Student Activity Center, Room 201</span>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium text-gray-900">National Competition Winner</div>
                  <div className="text-sm text-gray-600">1st Place in Inter-University Championship 2024</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Community Service Award</div>
                  <div className="text-sm text-gray-600">Outstanding contribution to local community projects</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Join Club
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Contact HiCom
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsModal;
