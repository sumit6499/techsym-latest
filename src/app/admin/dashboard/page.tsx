"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCw } from "lucide-react";
import StudentTable from "./components/student-table";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  email: string;
  events: string;
  isPaid: boolean;
  registrationDate: string;
  paymentMethod: string;
  paymentImage?: string;
}

interface Event {
  id: string;
  title: string;
}

export default function AdminDashboard() {
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchEvents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get<{ students: Student[] }>("/api/students");
      setStudents(res.data.students);
      setFilteredStudents(res.data.students);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get<Event[]>("/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
      setError("Error fetching events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, selectedEvent, paymentStatus);
  };

  const handleEventFilter = (value: string) => {
    setSelectedEvent(value);
    applyFilters(searchQuery, value, paymentStatus);
  };

  const handlePaymentFilter = (value: string) => {
    setPaymentStatus(value);
    applyFilters(searchQuery, selectedEvent, value);
  };

  const applyFilters = (search: string, event: string, payment: string) => {
    let result = students;

    if (search) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase()) ||
          student.id.toString().includes(search)
      );
    }

    if (event !== "all") {
      result = result.filter((student) => student.events === event);
    }

    if (payment !== "all") {
      const isPaid = payment === "paid";
      result = result.filter((student) => student.isPaid === isPaid);
    }

    setFilteredStudents(result);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedEvent("all");
    setPaymentStatus("all");
    setFilteredStudents(students);
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage student registrations and payments for tech events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Registrations</CardTitle>
          <CardDescription>View and manage all student registrations for tech events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or ID..."
                value={searchQuery}
                onChange={handleSearch}
                className="h-9"
              />
            </div>
            <Select value={selectedEvent} onValueChange={handleEventFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.title}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentStatus} onValueChange={handlePaymentFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <StudentTable students={filteredStudents} />
        </CardContent>
      </Card>
    </div>
  );
}
