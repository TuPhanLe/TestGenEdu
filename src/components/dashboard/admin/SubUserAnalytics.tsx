import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, UserStatus } from "@prisma/client";
import TableAnalyst from "./tableAnalytics/tableAnalyst";
import ClassAnalyst from "./tableAnalytics/classAnalyst";
import { allSchema } from "@/schemas/form/Columns/allColumns";
import { DataTableAll } from "@/components/table/components/mainTable/data-table-all";
import { allColumns } from "@/components/table/components/columns/allColumns";
import { formatDate } from "@/lib/utils";
import { DataTableLecturer } from "@/components/table/components/mainTable/data-table-lecturer";
import { lecturerColumns } from "@/components/table/components/columns/lecturerColumns";

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

type ClassData = {
  id: string;
  name: string | null;
  supervisorName: string | null;
  studentCount: number;
  createdAt: string;
};

interface SubUserAnalyticsProps {
  users: UserData[];
  classes: ClassData[];
}

const SubUserAnalytics = ({ users, classes }: SubUserAnalyticsProps) => {
  // Format user data to match the schema using allSchema
  const formattedUsers = users.map((user) => {
    // Format date to string
    const dateJoined = formatDate(user.createdAt); // Convert Date to ISO string format

    // Map role and status to string
    const role = user.role.toString();
    const status = user.status.toString();

    // Format the user data according to the schema
    const formattedUser = {
      name: user.name || "N/A",
      userName: user.userName || "N/A",
      role,
      dateJoined,
      email: user.email || "N/A",
      status,
    };

    // Validate the formatted data with the schema
    try {
      allSchema.parse(formattedUser);
    } catch (error) {
      console.error("User data validation failed:", error);
    }

    return formattedUser;
  });

  // Filter and format lecturers (role: LECTURE)
  const formattedLecturers = users
    .filter((user) => user.role === "LECTURER")
    .map((user) => {
      const dateJoined = formatDate(user.createdAt);
      const role = user.role.toString();
      const status = user.status.toString();

      const formattedLecturer = {
        name: user.name || "N/A",
        userName: user.userName || "N/A",
        role,
        dateJoined,
        email: user.email || "N/A",
        status,
      };

      // Validate the formatted data with the schema
      try {
        allSchema.parse(formattedLecturer);
      } catch (error) {
        console.error("Lecturer data validation failed:", error);
      }

      return formattedLecturer;
    });

  // Filter and format students (role: STUDENT)
  const formattedStudents = users
    .filter((user) => user.role === "STUDENT")
    .map((user) => {
      const dateJoined = formatDate(user.createdAt);
      const role = user.role.toString();
      const status = user.status.toString();

      const formattedStudent = {
        name: user.name || "N/A",
        userName: user.userName || "N/A",
        role,
        dateJoined,
        email: user.email || "N/A",
        status,
      };

      // Validate the formatted data with the schema
      try {
        allSchema.parse(formattedStudent);
      } catch (error) {
        console.error("Student data validation failed:", error);
      }

      return formattedStudent;
    });

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Member</TabsTrigger>
          <TabsTrigger value="class" className="hidden sm:flex">
            Class
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <DataTableAll columns={allColumns} data={formattedUsers} />
      </TabsContent>
      <TabsContent value="class">
        {/* <ClassAnalyst classes={classes} title="Classes" /> */}
      </TabsContent>
    </Tabs>
  );
};

export default SubUserAnalytics;
