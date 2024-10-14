import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { studentSchema } from "@/schemas/form/student";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentCollumsSchema } from "@/schemas/form/Columns/studentColumns";

// Define StudentData interface
interface StudentData {
  name: string;
  userName: string;
  password: string;
  email?: string; // Optional
  status: string;
  studentId: string;
  class: string;
  department: string;
}

// Define the props with userName
type Props = {
  userName: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onEditSuccess: (updatedStudent: any) => void;
};

export const EditStudent: React.FC<Props> = ({
  userName,
  setIsOpen,
  onEditSuccess,
}) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true); // Loading state

  type Input = z.infer<typeof studentCollumsSchema>;

  // Set up form
  const form = useForm<Input>({
    resolver: zodResolver(studentCollumsSchema),
    defaultValues: {
      name: "",
      userName: "",
      password: "",
      email: "",
      status: "ACTIVE",
      studentId: "",
      class: "",
      department: "",
    },
  });

  // Fetch student data based on userName using useEffect
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`/api/user/get/student`, {
          params: { userName }, // Pass userName in query parameters
        });
        const data: StudentData = response.data;

        // Update form with fetched data
        form.reset({
          name: data.name || "N/A",
          userName: data.userName || "N/A",
          email: data.email || "",
          status: data.status || "ACTIVE",
          studentId: data.studentId || "",
          class: data.class || "",
          department: data.department || "",
          password: "",
        });

        setStudentData(data); // Save data to local state
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setIsFetching(false); // Hide loading spinner
      }
    };

    fetchStudentData();
  }, [userName, form]);

  // Mutation for updating student data
  const [isPending, setIsPending] = useState(false); // Pending state for update

  const onSubmit = async (formData: Input) => {
    try {
      setIsPending(true);
      const response = await axios.put(`/api/user/update/student`, formData);
      onEditSuccess(response.data);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating student:", error);
    } finally {
      setIsPending(false);
    }
  };

  if (isFetching) {
    return <Loader2 className="h-6 w-6 animate-spin" />; // Show loading spinner while fetching data
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Student Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Username Field (Disabled) */}
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Username" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Type if you want reset your password!"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Student ID Field */}
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Student ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Class Field */}
        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Class" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department Field */}
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Department" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Dropdown */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex w-full sm:justify-end mt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
