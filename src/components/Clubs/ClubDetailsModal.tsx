import React from 'react';
import { X, Users, Calendar, Award, MapPin, Clock, Mail, Phone, Globe, Instagram, Facebook, Twitter } from 'lucide-react';
import { Club } from '../../types';

interface ClubDetailsModalProps {
  club: Club;
  onClose: () => void;
}

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({ club, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img
            src={club.image}
            alt={club.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg transition-all"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                {club.category}
              </span>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                Est. {club.establishedYear}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">{club.name}</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{club.memberCount}</div>
              <div className="text-sm text-blue-700">Active Members</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">12+</div>
              <div className="text-sm text-green-700">Events This Year</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">5</div>
              <div className="text-sm text-purple-700">Awards Won</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">About {club.name}</h2>
                <p className="text-gray-600 leading-relaxed">{club.description}</p>
              </div>

              {/* Mission & Vision */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mission & Vision</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Mission</h4>
                    <p className="text-gray-600 text-sm">
                      To provide a platform for students to develop their skills in {club.category.toLowerCase()}, 
                      foster creativity, and build lasting connections within the university community.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Vision</h4>
                    <p className="text-gray-600 text-sm">
                      To be the leading student organization that empowers members to excel in their chosen field 
                      and contribute meaningfully to society.
                    </p>
                  </div>
                </div>
              </div>

              {/* Activities & Programs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Activities & Programs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {club.activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Best Club Award 2024</div>
                      <div className="text-sm text-gray-600">Recognized for outstanding contribution to student life</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Award className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Community Service Excellence</div>
                      <div className="text-sm text-gray-600">500+ hours of community service completed</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Innovation Challenge Winner</div>
                      <div className="text-sm text-gray-600">First place in university-wide innovation competition</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leadership */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Leadership Team</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {club.hicomName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{club.hicomName}</div>
                      <div className="text-sm text-gray-600">President (HiCom)</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">VP</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Sarah Johnson</div>
                      <div className="text-sm text-gray-600">Vice President</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">S</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Mike Chen</div>
                      <div className="text-sm text-gray-600">Secretary</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Schedule */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Weekly Meetings</div>
                      <div className="text-sm text-gray-600">Every Wednesday, 7:00 PM</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-sm text-gray-600">Student Center Room 201</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium text-gray-900">{club.name.toLowerCase().replace(/\s+/g, '')}@university.edu</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium text-gray-900">+60 12-345 6789</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  <a href="#" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Requirements</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Current university student</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Minimum CGPA of 2.5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Commitment to attend meetings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Passion for {club.category.toLowerCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsModal;
