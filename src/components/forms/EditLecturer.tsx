"use client";

import React, { useEffect } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { lecturerSchema } from "@/schemas/form/lecturer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface LecturerData {
  name: string;
  userName: string;
  password: string;
  email?: string; // Optional
  status: string;
}
// Define the props with userName
type Props = {
  userName: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onEditSuccess: (updatedLecturer: any) => void;
};

export const EditLecturer: React.FC<Props> = ({
  userName,
  setIsOpen,
  onEditSuccess,
}) => {
  type Input = z.infer<typeof lecturerSchema>;

  // Set up form
  const form = useForm<Input>({
    resolver: zodResolver(lecturerSchema),
    defaultValues: {
      name: "",
      userName: "",
      password: "",
      email: "",
      status: "ACTIVE",
    },
  });

  // Fetch lecturer data based on userName
  const { data: lecturerData, isLoading: isFetching } = useQuery<LecturerData>(
    ["lecturer", userName],
    async () => {
      const response = await axios.get(`/api/user/get/${userName}`);
      return response.data as LecturerData; // Cast the API response to LecturerData
    },
    {
      onSuccess: (data) => {
        if (data) {
          form.reset({
            name: data.name || "N/A",
            userName: data.userName || "N/A",
            email: data.email || "",
            status: data.status || "ACTIVE",
          });
        }
      },
    }
  );

  // Mutation for updating lecturer data
  const { mutate: updateLecturer, isPending } = useMutation({
    mutationFn: async (formData: Input) => {
      const response = await axios.put(
        `/api/user/update/${userName}`,
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      onEditSuccess(data);
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error updating lecturer:", error);
    },
  });

  // Handle form submission
  const onSubmit = (formData: Input) => {
    updateLecturer(formData);
  };

  if (isFetching) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Lecturer Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
