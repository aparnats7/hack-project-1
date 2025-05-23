import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../components/ui/use-toast';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  FileText,
  Key,
  History,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [idDocument, setIdDocument] = useState(null);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '',
    address: '',
    organization: '',
    designation: '',
  });
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activityLog, setActivityLog] = useState([
    {
      type: 'login',
      timestamp: '2024-03-20T10:30:00',
      details: 'Login from New Delhi, India',
    },
    {
      type: 'verification',
      timestamp: '2024-03-19T15:45:00',
      details: 'Document verification completed',
    },
  ]);

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profile') {
        setProfileImage(URL.createObjectURL(file));
        toast({
          title: 'Success',
          description: 'Profile picture updated successfully',
        });
      } else if (type === 'id') {
        setIdDocument(URL.createObjectURL(file));
        setVerificationStatus('pending');
        toast({
          title: 'Success',
          description: 'ID document uploaded successfully',
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                />
              </label>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{formData.name}</h1>
                {verificationStatus === 'verified' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : verificationStatus === 'pending' ? (
                  <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="text-muted-foreground">{formData.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Details */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Personal Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      icon={<Phone className="w-4 h-4" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    icon={<MapPin className="w-4 h-4" />}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </div>

            {/* Verification Details */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Verification Details</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Verification Status</h3>
                      <p className="text-sm text-muted-foreground">
                        {verificationStatus === 'verified'
                          ? 'Your account is verified'
                          : verificationStatus === 'pending'
                          ? 'Verification in progress'
                          : 'Verification required'}
                      </p>
                    </div>
                  </div>
                  {verificationStatus !== 'verified' && (
                    <Button variant="outline">Verify Now</Button>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Government ID</h3>
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center">
                    {idDocument ? (
                      <div className="space-y-4">
                        <img
                          src={idDocument}
                          alt="ID Document"
                          className="max-h-40 mx-auto rounded"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('id-upload').click()}
                        >
                          Re-upload ID
                        </Button>
                        <input
                          id="id-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'id')}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FileText className="w-12 h-12 text-primary mx-auto" />
                        <p className="text-muted-foreground">
                          Upload your government-issued ID
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('id-upload').click()}
                        >
                          Upload ID
                        </Button>
                        <input
                          id="id-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'id')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings & Activity Log */}
          <div className="space-y-8">
            {/* Account Settings */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button
                    variant={twoFactorEnabled ? 'default' : 'outline'}
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  >
                    {twoFactorEnabled ? 'Enabled' : 'Enable'}
                  </Button>
                </div>

                <div className="pt-6 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/change-password')}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Activity Log</h2>
              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg"
                  >
                    <History className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">{activity.details}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 