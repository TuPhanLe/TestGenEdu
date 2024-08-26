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
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Test } from "@prisma/client";

interface Selections {
  [key: string]: boolean;
}

type Props = {
  cardId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tests: Test[];
};

export const AddFolder: React.FC<Props> = ({ cardId, setIsOpen, tests }) => {
  type Input = z.infer<typeof folderSchema>;

  const form = useForm<z.infer<typeof folderSchema>>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "Default",
      description: "Description",
      selectedTest: [], // Ensure this is part of the default values
    },
  });

  // Generate options with test names and createdAt dates
  const options = tests.map((test) => ({
    id: test.id,
    label: `${test.topic} - ${new Date(
      test.createdAt
    ).toLocaleDateString()} ${new Date(test.createdAt).toLocaleTimeString()}`,
  }));

  const [selections, setSelections] = useState<Selections>(
    options.reduce<Selections>(
      (acc, option) => ({ ...acc, [option.id]: false }),
      {}
    )
  );

  const toggleSelection = (optionId: string) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [optionId]: !prevSelections[optionId],
    }));
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof folderSchema>) => {
    try {
      // Capture the selected tests
      const selectedTest = Object.keys(selections).filter(
        (optionId) => selections[optionId]
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
              <React.Fragment key={option.id}>
                <div className="flex items-center">
                  <Checkbox
                    checked={selections[option.id]}
                    onCheckedChange={() => toggleSelection(option.id)}
                    id={option.id}
                  />
                  <label htmlFor={option.id} className="ml-2">
                    {option.label}
                  </label>
                </div>
                <Separator />
              </React.Fragment>
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
};
