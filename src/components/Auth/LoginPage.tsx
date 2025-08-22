import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const roles = [
    { value: 'ppmk_member', label: 'PPMK Member', email: 'ahmad@ppmk.edu.my' },
    { value: 'club_member', label: 'Club Member', email: 'siti@robotics.ppmk.edu.my' },
    { value: 'club_hicom', label: 'Club HiCom', email: 'farid@robotics.ppmk.edu.my' },
    { value: 'ppmk_biro', label: 'PPMK Biro', email: 'aminah@biro.ppmk.edu.my' },
    { value: 'ppmk_hicom', label: 'PPMK HiCom', email: 'ibrahim@hicom.ppmk.edu.my' }
  ];

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role.value);
    setEmail(role.email);
    setPassword('password123'); // Auto-fill password
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Use password: password123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PPMKConnect</h1>
          <p className="text-gray-600">Connect with clubs and activities</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Role Selection - Now under the sign-in form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Login - Select Your Role</h2>
          <div className="grid grid-cols-1 gap-3">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleSelect(role)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  selectedRole === role.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{role.label}</div>
                <div className="text-sm text-gray-500">{role.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-medium text-gray-900 mb-2">Demo Credentials:</h3>
          <p className="text-sm text-gray-600">
            Select any role above to auto-fill credentials, or manually enter:
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Password: <code className="bg-gray-200 px-1 rounded">password123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
