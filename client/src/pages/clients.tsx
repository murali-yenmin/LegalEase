import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { Client } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, Briefcase, DollarSign, Search, Eye, Edit, Trash2, Mail, Phone } from "lucide-react";

interface ClientsResponse {
  clients: Client[];
  total: number;
  page: number;
  totalPages: number;
}

interface ClientFilters {
  search: string;
  clientType: string;
  status: string;
  page: number;
}

interface ClientStats {
  total: number;
  activeCases: number;
  newThisMonth: number;
  outstandingInvoices: string;
}

export default function Clients() {
  const { hasRole } = useAuth();
  const [filters, setFilters] = useState<ClientFilters>({
    search: "",
    clientType: "",
    status: "",
    page: 1,
  });

  const { data, isLoading } = useQuery<ClientsResponse>({
    queryKey: ["/api/clients", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      
      return fetch(`/api/clients?${params}`, {
        headers: getAuthHeaders(),
      }).then(res => res.json());
    },
  });

  // Mock client stats - in real app this would come from API
  const clientStats: ClientStats = {
    total: data?.total || 0,
    activeCases: 89,
    newThisMonth: 12,
    outstandingInvoices: "$28,450"
  };

  const updateFilter = (key: keyof ClientFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "prospect":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getClientTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "individual":
        return "Individual Client";
      case "corporate":
        return "Corporate Client";
      case "government":
        return "Government Entity";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-500 mt-1">Manage client information and relationships</p>
        </div>
        {hasRole(["admin", "advocate", "staff"]) && (
          <Button className="bg-primary hover:bg-primary-600">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        )}
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{clientStats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-600 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Cases</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{clientStats.activeCases}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Briefcase className="text-green-600 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">New This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{clientStats.newThisMonth}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <UserPlus className="text-purple-600 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Outstanding Invoices</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{clientStats.outstandingInvoices}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-amber-600 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Clients
              </Label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Name, email, phone..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Client Type</Label>
              <Select value={filters.clientType} onValueChange={(value) => updateFilter("clientType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Status</Label>
              <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary-100 text-primary-600 text-lg font-semibold">
                        {getInitials(client.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.fullName}</h3>
                      <p className="text-sm text-gray-500">{getClientTypeLabel(client.clientType)}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>3 Active Cases</span> {/* This would come from API */}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">Total Billed:</span>
                    <span className="font-semibold text-gray-900 ml-1">$15,750</span> {/* This would come from API */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-primary-600 hover:bg-primary-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {hasRole(["admin", "advocate", "staff"]) && (
                      <>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {((data.page - 1) * 12) + 1} to {Math.min(data.page * 12, data.total)} of {data.total} clients
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page === 1}
                  onClick={() => updateFilter("page", data.page - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={data.page === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter("page", page)}
                      className={data.page === page ? "bg-primary text-white" : ""}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page === data.totalPages}
                  onClick={() => updateFilter("page", data.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
