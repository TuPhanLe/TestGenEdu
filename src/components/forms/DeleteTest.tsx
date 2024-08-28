import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  cardId: z.string(),
});

export default function DeleteTest({
  cardId,
  setIsOpen,
  onDeleteSuccess, // Callback function to notify parent about deletion
}: {
  cardId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDeleteSuccess: () => void; // Callback function to notify parent about successful deletion
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: cardId,
    },
  });

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/test/delete", {
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

  const isLoading = form.formState.isSubmitting;

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
