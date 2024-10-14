"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the schema for form validation
const formSchema = z.object({
  classId: z.string().nullable().optional(), // Class ID to delete
});

export default function DeleteClass({
  classId,
  setIsOpen,
  onDeleteSuccess, // Callback function to notify parent about deletion
}: {
  classId: string | null; // ID of the class to be deleted
  setIsOpen: Dispatch<SetStateAction<boolean>>; // Function to close the modal
  onDeleteSuccess: () => void; // Callback function to notify parent about successful deletion
}) {
  // Set up the form with default values and validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: classId, // Pre-fill the form with the class ID
    },
  });

  // Function to handle class deletion
  const handleDelete = async () => {
    try {
      const response = await fetch("/api/class/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the class");
      }

      onDeleteSuccess(); // Notify parent about successful deletion
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete the class:", error);
      // Optionally, you can show an error message here
    }
  };

  const isLoading = form.formState.isSubmitting; // Check if the form is submitting

  // Handle form submission
  const onSubmit = async () => {
    try {
      handleDelete();
    } catch (error) {
      console.error("Error in submission:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 sm:px-0 px-4"
      >
        <div className="w-full flex justify-center sm:space-x-6">
          {/* Cancel button */}
          <Button
            size="lg"
            variant="outline"
            disabled={isLoading}
            className="w-full hidden sm:block"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          {/* Delete button */}
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting
              </>
            ) : (
              <span>Delete</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
