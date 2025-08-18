import { WorkerLayout } from '@/components/worker/Dashboard/WorkerLayout';
import { WorkerStatsCard } from '@/components/worker/Dashboard/WorkerStatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Wrench,
  Zap,
  Calendar,
  DollarSign,
  MessageCircle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

import { Navbar } from '@/components/worker/Dashboard/WorkerNavbar';
import type { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { authService } from '@/api/AuthService';
import { ErrorToast } from '@/components/shared/Toaster';

export default function WorkerDashboard() {
  const [data, setData] = useState<any>(null);


  const worker = useSelector((state: RootState) => state.workerTokenSlice.worker);

  useEffect(()=>{
    fetchWorker()
  },[])

  const fetchWorker=async()=>{
    try {
       const res = await  authService.workerIsVerified(String(worker?.email))
       console.log(res)
       if(res.status==400){
        ErrorToast(res.data.message)
        return 
       }
        setData(res.data);
    } catch (error) {
      ErrorToast("Something Went Wrong")
    }
  }
  if (!data) {
    return (
      
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
     
    );
  }
  if (data.status === "pending") {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="text-center p-10 rounded-2xl shadow-lg bg-white">
          <ShieldCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-700">Profile Under Review</h1>
          <p className="mt-2 text-green-600">
            Your profile has been submitted and is awaiting admin approval. 🚀
          </p>
        </div>
      </div>
    </>
  );
}

if (data.status === "rejected") {
  return (<>
    <Navbar />
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-10 rounded-2xl shadow-lg bg-white">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-700">Profile Rejected</h1>
          <p className="mt-2 text-red-600">
            Sorry, your profile was rejected by admin. Please contact support or update your details.
          </p>
          <Button
            className="mt-4 bg-red-600 text-white hover:bg-red-700"
            onClick={() => (window.location.href = "/worker/profile/edit")}
          >
            Update Profile
          </Button>
        </div>
      </div>
    </>
  );
}

  return (
    <WorkerLayout>
      <Navbar />
      <div className="p-8 space-y-8 bg-gradient-to-br from-background via-background to-muted/20">
        {/* Welcome */}
        <div className="fade-slide-in">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, {worker?.name || 'Superstar'}! 👷‍♂️
              </h1>
              <p className="text-muted-foreground text-lg">
                Here's your job summary for today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-foreground">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <WorkerStatsCard
            title="Total Jobs"
            value="64"
            change="10% increase"
            trend="up"
            icon={<Wrench className="h-5 w-5 text-black" />}
          />
          <WorkerStatsCard
            title="Monthly Earnings"
            value="₹42,800"
            change="5% increase"
            trend="up"
            icon={<DollarSign className="h-5 w-5 text-black" />}
          />
          <WorkerStatsCard
            title="Upcoming Jobs"
            value="5"
            change="2 today"
            trend="neutral"
            icon={<Calendar className="h-5 w-5 text-black" />}
          />
          <WorkerStatsCard
            title="Rating"
            value="4.8 / 5"
            change="132 reviews"
            trend="up"
            icon={<CheckCircle className="h-5 w-5 text-black" />}
          />
        </div>

        {/* Schedule + Side Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule */}
          <div className="lg:col-span-2 fade-slide-in">
            <Card className="h-full bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-xl font-bold text-foreground">
                    Today’s Jobs
                  </CardTitle>
                  <Badge className="bg-black text-white">5 total</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { time: '9:00 AM', task: 'Fix kitchen tap', client: 'Rahul Singh', status: 'completed' },
                  { time: '11:00 AM', task: 'AC wiring check', client: 'Priya Sharma', status: 'in-progress' },
                  { time: '1:30 PM', task: 'Fan installation', client: 'Ajay Kumar', status: 'upcoming' },
                  { time: '3:00 PM', task: 'Bathroom leak fix', client: 'Sneha Das', status: 'upcoming' },
                ].map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">{job.time}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{job.task}</p>
                        <p className="text-sm text-muted-foreground">{job.client}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        job.status === 'completed'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : job.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Performance */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-black text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-white text-black hover:bg-gray-100 justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Start Job
                </Button>
                <Button className="w-full bg-white/10 text-white hover:bg-white/20 justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Client
                </Button>
                <Button className="w-full bg-white/10 text-white hover:bg-white/20 justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  View Earnings
                </Button>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Job Efficiency</span>
                      <span className="font-medium text-foreground">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Client Satisfaction</span>
                      <span className="font-medium text-foreground">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-foreground">Most Rated Worker</span>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">This Month</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
}
