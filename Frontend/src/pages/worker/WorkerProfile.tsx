import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  Calendar, 
  FileText, 
  Edit3,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Award,
  Download,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkerLayout } from '@/components/worker/Dashboard/WorkerLayout';
import { Navbar } from '@/components/worker/Dashboard/WorkerNavbar';

// ✅ Define types for better type-safety
interface WorkerDocument {
  id: number;
  name: string;
  type: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  url: string;
}

interface WorkerAvailability {
  workingDays: string;
  workingHours: string;
  timezone: string;
}

interface Worker {
  id: number;
  fullName: string;
  category: string;
  email: string;
  phone: string;
  avatar?: string;
  yearsExperience: number;
  hourlyRate: number;
  skills: string[];
  availability: WorkerAvailability;
  documents: WorkerDocument[];
}

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ size?: number }>;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-2 text-gray-600">
      {Icon && <Icon size={16} />}
      <span className="font-medium">{label}</span>
    </div>
    <div className="text-gray-900 font-medium text-right flex-1 ml-4">
      {value}
    </div>
  </div>
);

interface SectionCardProps {
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon: Icon, children, className = "" }) => (
  <Card className={`transition-all duration-300 hover:shadow-md ${className}`}>
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <Icon   size={20} />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
    </CardHeader>
    <CardContent className="pt-0">{children}</CardContent>
  </Card>
);

const WorkerProfilePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Strongly typed mock data
  const workerData: Worker = {
    id: 1,
    fullName: "Sarah Johnson",
    category: "Home Cleaning Specialist",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    yearsExperience: 5,
    hourlyRate: 25,
    skills: ["Deep Cleaning", "Eco-Friendly Products", "Pet-Friendly Cleaning", "Organization"],
    availability: {
      workingDays: "Monday - Friday",
      workingHours: "9:00 AM - 5:00 PM",
      timezone: "EST"
    },
    documents: [
      { id: 1, name: "ID Verification", type: "ID Proof", status: "Verified", url: "#" },
      { id: 2, name: "Cleaning Certification", type: "Professional Certificate", status: "Verified", url: "#" },
      { id: 3, name: "Insurance Certificate", type: "Insurance", status: "Verified", url: "#" }
    ]
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // ✅ Type parameter explicitly
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <WorkerLayout>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div
            className={`max-w-4xl mx-auto transition-all duration-700 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
            {/* Header with Back Button */}
            <div className="mb-6">
            <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-gray-100"
                onClick={() => window.history.back()}
            >
                <ArrowLeft size={16} />
                Back to Dashboard
            </Button>
            </div>

            {/* Profile Header Card */}
            <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
                <div className="relative">
                {/* Edit Button */}
                <Button
                    size="sm"
                    className="absolute top-0 right-0 flex items-center gap-1"
                    onClick={() => alert('Edit Profile clicked')}
                >
                    <Edit3 size={14} />
                    Edit Profile
                </Button>

                {/* Profile Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="relative">
                    {workerData.avatar ? (
                        <img
                        src={workerData.avatar}
                        alt={workerData.fullName}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                    ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold border-4 border-white shadow-md">
                        {getInitials(workerData.fullName)}
                        </div>
                    )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        {workerData.fullName}
                    </h1>
                    <p className="text-blue-600 font-semibold text-lg mb-2">
                        {workerData.category}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {workerData.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                        </Badge>
                        ))}
                        {workerData.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{workerData.skills.length - 3} more
                        </Badge>
                        )}
                    </div>
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Information Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <SectionCard title="Personal Information" icon={User}>
                <div className="space-y-1">
                <InfoItem label="Full Name" value={workerData.fullName} />
                <InfoItem label="Email" value={workerData.email} icon={Mail} />
                <InfoItem label="Phone" value={workerData.phone} icon={Phone} />
                </div>
            </SectionCard>

            {/* Professional Information */}
            <SectionCard title="Professional Information" icon={Briefcase}>
                <div className="space-y-1">
                <InfoItem label="Category" value={workerData.category} />
                <InfoItem label="Experience" value={`${workerData.yearsExperience} years`} icon={Award} />
                <InfoItem label="Hourly Rate" value={`$${workerData.hourlyRate}/hour`} icon={DollarSign} />
                <div className="pt-2 border-t border-gray-100">
                    <span className="font-medium text-gray-600 text-sm mb-2 block">Skills & Specializations</span>
                    <div className="flex flex-wrap gap-1">
                    {workerData.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                        </Badge>
                    ))}
                    </div>
                </div>
                </div>
            </SectionCard>

            {/* Availability */}
            <SectionCard title="Availability" icon={Calendar}>
                <div className="space-y-1">
                <InfoItem label="Working Days" value={workerData.availability.workingDays} />
                <InfoItem label="Working Hours" value={workerData.availability.workingHours} icon={Clock} />
                <InfoItem label="Timezone" value={workerData.availability.timezone} />
                </div>
            </SectionCard>

            {/* Documents */}
            <SectionCard title="Documents & Certifications" icon={FileText}>
                <div className="space-y-3">
                {workerData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{doc.name}</h4>
                        <p className="text-gray-600 text-xs">{doc.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={doc.status === 'Verified' ? 'default' : 'outline'} className="text-xs">
                        {doc.status}
                        </Badge>
                        <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => alert(`Viewing ${doc.name}`)}
                        >
                            <Eye size={14} />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => alert(`Downloading ${doc.name}`)}
                        >
                            <Download size={14} />
                        </Button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </SectionCard>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" size="lg" onClick={() => alert('Contact Worker clicked')}>
                Contact Worker
            </Button>
            <Button size="lg" onClick={() => alert('Book Service clicked')}>
                Book Service
            </Button>
            </div>
        </div>
        </div>
    </WorkerLayout>
  );
};

export default WorkerProfilePage;
