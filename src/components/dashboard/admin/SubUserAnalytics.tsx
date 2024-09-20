import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, UserStatus } from "@prisma/client";
import TableAnalyst from "./tableAnalytics/tableAnalyst";

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
};

interface SubUserAnalyticsProps {
  users: UserData[];
}

const SubUserAnalytics = ({ users }: SubUserAnalyticsProps) => {
  // Convert Date to string in desired format
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(); // You can customize the format here
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="lecturer">Lecturer</TabsTrigger>
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Class
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <TableAnalyst users={users} title="Users" />
      </TabsContent>
      <TabsContent value="lecturer">
        <TableAnalyst
          users={users}
          title="Lecturers"
          roleFilter={UserRole.LECTURE}
        />
      </TabsContent>
      <TabsContent value="student">
        <TableAnalyst
          users={users}
          title="Students"
          roleFilter={UserRole.STUDENT}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SubUserAnalytics;
