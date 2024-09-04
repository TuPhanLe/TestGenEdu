"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

// Define the schema for form validation
const formSchema = z.object({
  cardId: z.string().nullable().optional(),
});

export default function DeleteFolder({
  cardId,
  setIsOpen,
  onDeleteSuccess, // Callback function to notify parent about deletion
}: {
  cardId: string | null; // ID of the folder to be deleted
  setIsOpen: Dispatch<SetStateAction<boolean>>; // Function to close the modal
  onDeleteSuccess: () => void; // Callback function to notify parent about successful deletion
}) {
  // Set up the form with default values and validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: cardId, // Pre-fill the form with the folder ID
    },
  });

  // Set up the mutation for deleting the folder
  const handleDelete = async () => {
    try {
      const response = await fetch("/api/folder/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the test");
      }

      onDeleteSuccess(); // Notify parent about successful deletion
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete the test:", error);
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
