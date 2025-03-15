"use client";

import { useState } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Mail, Eye, Edit, Trash, CheckCircle, XCircle, ImageIcon, Users } from "lucide-react";
import type { Student } from "@/lib/types";

export default function StudentTable({ students }: any) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleViewPaymentImage = (student: Student) => {
    setSelectedStudent(student);
    setIsImageDialogOpen(true);
  };

  const handleViewTeamMembers = (student: Student) => {
    setSelectedStudent(student);
    setIsTeamDialogOpen(true);
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Event Name</TableHead>
              <TableHead>Registration Type</TableHead>
              <TableHead>Team Members</TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Payment Proof</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student: any) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.event || "N/A"}</TableCell>
                  <TableCell>
                    {student.registration?.registrationType === "individual" ? (
                      <Badge variant="default">Individual</Badge>
                    ) : (
                      <Badge variant="secondary">Group</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.registrationType === "group" && student.teamMembers?.length > 0 ? (
                      <Button variant="outline" size="sm" onClick={() => handleViewTeamMembers(student)}>
                        <Users className="w-4 h-4 mr-1" />
                        View Members
                      </Button>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {student.totalAmountPaid || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.isPaid ? "default" : "destructive"}>
                      {student.isPaid?"Paid": "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.paymentImage ? (
                      <Button variant="outline" size="sm" onClick={() => handleViewPaymentImage(student)}>
                        <ImageIcon className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    ) : (
                      "No Proof"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Team Members Dialog */}
      {selectedStudent?.teamMembers && selectedStudent.teamMembers?.length > 0 && (
        <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Team Members</DialogTitle>
              <DialogDescription>List of all team members.</DialogDescription>
            </DialogHeader>
            <ul className="list-disc pl-4">
              {selectedStudent.teamMembers.map((member: any) => (
                <li key={member.id}>{member.name}</li>
              ))}
            </ul>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTeamDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedStudent && selectedStudent.paymentImage && (
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Payment Proof</DialogTitle>
              <DialogDescription>Uploaded payment screenshot</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
              <Image
                src={selectedStudent.paymentImage}
                alt="Payment Screenshot"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}