import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import {
  FolderOpen,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  UserPlus,
  CalendarPlus,
  Upload,
  FileText,
  RefreshCw,
  Gavel,
  Handshake,
  AlertTriangle
} from "lucide-react";

interface DashboardMetrics {
  activeCases: number;
  upcomingHearings: number;
  pendingInvoices: string;
  totalClients: number;
  activeCasesChange: number;
  clientsChange: number;
}

interface RecentCase {
  id: number;
  title: string;
  clientName: string;
  status: string;
  nextHearing?: string;
  completedDate?: string;
  caseType: string;
}

interface UpcomingHearing {
  id: number;
  title: string;
  court: string;
  room: string;
  scheduledAt: string;
  caseType: string;
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/metrics", {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  });

  const { data: recentCases, isLoading: casesLoading } = useQuery<RecentCase[]>({
    queryKey: ["/api/dashboard/recent-cases"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/recent-cases", {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  });

  const { data: upcomingHearings, isLoading: hearingsLoading } = useQuery<UpcomingHearing[]>({
    queryKey: ["/api/dashboard/upcoming-hearings"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/upcoming-hearings", {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  });

  const getCaseIcon = (caseType: string) => {
    switch (caseType.toLowerCase()) {
      case "criminal":
        return <AlertTriangle className="h-4 w-4" />;
      case "corporate":
        return <Handshake className="h-4 w-4" />;
      default:
        return <Gavel className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      case "in progress":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.fullName}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary-600">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Cases</p>
                {metricsLoading ? (
                  <Skeleton className="h-8 w-16 mt-2" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metrics?.activeCases || 0}
                  </p>
                )}
                <div className="flex items-center mt-2">
                  {metricsLoading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 text-sm font-medium ml-1">
                        +{metrics?.activeCasesChange || 0}%
                      </span>
                      <span className="text-gray-500 text-sm ml-2">vs last month</span>
                    </>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FolderOpen className="text-blue-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Upcoming Hearings</p>
                {metricsLoading ? (
                  <Skeleton className="h-8 w-16 mt-2" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metrics?.upcomingHearings || 0}
                  </p>
                )}
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span className="text-gray-500 text-sm ml-2">Next 7 days</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Calendar className="text-amber-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending Invoices</p>
                {metricsLoading ? (
                  <Skeleton className="h-8 w-20 mt-2" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metrics?.pendingInvoices || "$0"}
                  </p>
                )}
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 text-sm font-medium ml-1">-5%</span>
                  <span className="text-gray-500 text-sm ml-2">overdue</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-green-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Clients</p>
                {metricsLoading ? (
                  <Skeleton className="h-8 w-16 mt-2" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metrics?.totalClients || 0}
                  </p>
                )}
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 text-sm font-medium ml-1">
                    +{metrics?.clientsChange || 0}%
                  </span>
                  <span className="text-gray-500 text-sm ml-2">new this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Cases</CardTitle>
                <Link href="/cases">
                  <Button variant="link" className="text-primary hover:text-primary-600 p-0">
                    View all
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {casesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCases?.map((case_) => (
                    <div
                      key={case_.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          {getCaseIcon(case_.caseType)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{case_.title}</h4>
                          <p className="text-sm text-gray-500">Client: {case_.clientName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(case_.status)}>
                          {case_.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {case_.nextHearing
                            ? `Next: ${formatDate(case_.nextHearing)}`
                            : case_.completedDate
                            ? `Completed: ${formatDate(case_.completedDate)}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="quick-action-btn">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="text-blue-600 h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New Case</p>
                <p className="text-sm text-gray-500">Create a new legal case</p>
              </div>
            </Button>

            <Button variant="ghost" className="quick-action-btn">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserPlus className="text-green-600 h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Client</p>
                <p className="text-sm text-gray-500">Register new client</p>
              </div>
            </Button>

            <Button variant="ghost" className="quick-action-btn">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <CalendarPlus className="text-amber-600 h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Schedule Hearing</p>
                <p className="text-sm text-gray-500">Book court hearing</p>
              </div>
            </Button>

            <Button variant="ghost" className="quick-action-btn">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="text-blue-600 h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Upload Document</p>
                <p className="text-sm text-gray-500">Add case documents</p>
              </div>
            </Button>

            <Button variant="ghost" className="quick-action-btn">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="text-purple-600 h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Generate Invoice</p>
                <p className="text-sm text-gray-500">Create client bill</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Hearings and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Hearings</CardTitle>
              <Link href="/hearings">
                <Button variant="link" className="text-primary hover:text-primary-600 p-0">
                  View calendar
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {hearingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-1" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingHearings?.map((hearing) => {
                  const date = new Date(hearing.scheduledAt);
                  const month = date.toLocaleDateString("en-US", { month: "short" });
                  const day = date.getDate();
                  
                  return (
                    <div
                      key={hearing.id}
                      className="flex items-center space-x-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="text-center">
                        <div className="text-xs font-semibold text-blue-600 uppercase">
                          {month}
                        </div>
                        <div className="text-lg font-bold text-blue-700">{day}</div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{hearing.title}</p>
                        <p className="text-sm text-gray-500">
                          {hearing.court}, {hearing.room}
                        </p>
                        <p className="text-sm text-blue-600 font-medium">
                          {formatTime(hearing.scheduledAt)} - {hearing.caseType}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Upload className="text-green-600 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Case document uploaded</p>
                  <p className="text-xs text-gray-500">Contract Amendment.pdf for TechCorp merger</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-blue-600 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Hearing scheduled</p>
                  <p className="text-xs text-gray-500">Smith vs. Johnson - December 15, 2:30 PM</p>
                  <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserPlus className="text-amber-600 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New client registered</p>
                  <p className="text-xs text-gray-500">Sarah Mitchell - Corporate Law consultation</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="text-purple-600 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Invoice paid</p>
                  <p className="text-xs text-gray-500">$5,250 payment received from Robert Smith</p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
