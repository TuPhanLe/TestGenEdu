"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ResponsiveDialog } from "@/components/forms/responsive-dialog";
import { formatDate } from "@/lib/utils";
import { CreateLecturer } from "@/components/forms/CreateLecturer";
import { CreateStudent } from "@/components/forms/CreateStudent";
import { UserRole, UserStatus } from "@prisma/client";

type UserData = {
  id: string;
  userName: string | null;
  name: string | null;
  email: string | null;
  studentId: string | null;
  department: string | null;
  class: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
};

interface TableAnalystProps {
  users: UserData[];
  title: string;
  roleFilter?: string;
  isAdmin?: boolean;
}

const TableAnalyst: React.FC<TableAnalystProps> = ({
  users,
  title,
  roleFilter,
  isAdmin = false,
}) => {
  // Default addType based on roleFilter if not admin
  const initialAddType: "LECTURE" | "STUDENT" =
    roleFilter === "LECTURE" ? "LECTURE" : "STUDENT";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addType, setAddType] = useState<"LECTURE" | "STUDENT">(
    isAdmin ? "LECTURE" : initialAddType // Set based on admin status
  );

  const handleCreateSuccess = () => {
    setIsAddOpen(false);
  };

  const filteredUsers = roleFilter
    ? users.filter((user) => user.role === roleFilter)
    : users;

  const handleAddTypeSelect = (type: "LECTURE" | "STUDENT") => {
    setAddType(type);
    setIsAddOpen(true);
  };

  return (
    <Card>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title={`Add ${addType === "LECTURE" ? "LECTURE" : "STUDENT"}`}
      >
        {addType === "LECTURE" ? (
          <CreateLecturer
            onCreateSuccess={handleCreateSuccess}
            setIsOpen={setIsAddOpen}
          />
        ) : (
          <CreateStudent
            onCreateSuccess={handleCreateSuccess}
            setIsOpen={setIsAddOpen}
          />
        )}
      </ResponsiveDialog>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Manage your {title.toLowerCase()} and view their details.
        </CardDescription>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Date Joined</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" variant="outline" className="h-7 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>

          {isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-7 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleAddTypeSelect("LECTURE")}
                >
                  Lecturer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleAddTypeSelect("STUDENT")}
                >
                  Student
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="h-7 gap-1"
              onClick={() => setIsAddOpen(true)}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add {addType === "LECTURE" ? "lecturer" : "student"}
              </span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>User Name</TableHead>
              {roleFilter === "STUDENT" && (
                <>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Department</TableHead>
                </>
              )}
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.userName}</TableCell>
                {roleFilter === "STUDENT" && (
                  <>
                    <TableCell>{user.studentId}</TableCell>
                    <TableCell>{user.class}</TableCell>
                    <TableCell>{user.department}</TableCell>
                  </>
                )}
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{filteredUsers.length}</strong> {title.toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TableAnalyst;
