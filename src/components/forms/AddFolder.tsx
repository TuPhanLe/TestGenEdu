"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { folderSchema } from "@/schemas/form/folder";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area"; // Import your ScrollArea component
import { Separator } from "../ui/separator";

interface Selections {
  [key: string]: boolean;
}

export default function AddFolder({
  cardId,
  setIsOpen,
}: {
  cardId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  type Input = z.infer<typeof folderSchema>;

  const form = useForm<z.infer<typeof folderSchema>>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "Default",
      description: "Description",
      selectedTest: [], // Ensure this is part of the default values
    },
  });

  const options: string[] = [
    "Test 1",
    "Test 2",
    "Test 3",
    "Test 4",
    "Test 3",
    "Test 4",
    "Test 3",
    "Test 4",
    "Test 3",
    "Test 4",
    "Test 3",
    "Test 4",
    "Test 3",
    "Test 4",
  ];

  const [selections, setSelections] = useState<Selections>(
    options.reduce<Selections>(
      (acc, option) => ({ ...acc, [option]: false }),
      {}
    )
  );

  const toggleSelection = (option: string) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [option]: !prevSelections[option],
    }));
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof folderSchema>) => {
    try {
      // Capture the selected tests
      const selectedTest = Object.keys(selections).filter(
        (option) => selections[option]
      );

      // Include selectedTest in the form values
      const formData = {
        ...values,
        selectedTest,
      };

      console.log(formData); // Log the form data to verify

      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }: { field: any }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Folder Name"
                  className="text-md"
                  required
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }: { field: any }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Folder Description"
                  className="text-md"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormLabel>Test</FormLabel>
        <ScrollArea className="max-h-60 p-4 border rounded-md">
          <div className="flex flex-col space-y-2">
            {options.map((option) => (
              <>
                <div key={option} className="flex items-center">
                  <Checkbox
                    checked={selections[option]}
                    onCheckedChange={() => toggleSelection(option)}
                    id={option}
                  />
                  <label htmlFor={option} className="ml-2">
                    {option}
                  </label>
                </div>
                <Separator />
              </>
            ))}
          </div>
        </ScrollArea>

        <div className="flex w-full sm:justify-end mt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </>
          </Button>
        </div>
      </form>
    </Form>
  );
}
