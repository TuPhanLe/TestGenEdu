import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, UserStatus } from "@prisma/client";
import TableAnalyst from "./tableAnalytics/tableAnalyst";
import ClassAnalyst from "./tableAnalytics/classAnalyst";

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
  // Convert Date to string in desired format

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="lecturer">Lecturer</TabsTrigger>
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="class" className="hidden sm:flex">
            Class
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <TableAnalyst users={users} title="Users" isAdmin={true} />
      </TabsContent>
      <TabsContent value="lecturer">
        <TableAnalyst users={users} title="Lecturers" roleFilter="LECTURE" />
      </TabsContent>
      <TabsContent value="student">
        <TableAnalyst users={users} title="Students" roleFilter="STUDENT" />
      </TabsContent>
      <TabsContent value="class">
        <ClassAnalyst classes={classes} title="Classes" />
      </TabsContent>
    </Tabs>
  );
};

export default SubUserAnalytics;
