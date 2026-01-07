"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { QuizCreationSchema } from "@/schema/form/quiz";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import LoadingQuestions from "./LoadingQuestions";
import { set } from "zod";

type Props = {
  topic?: string;
};

type InputForm = z.infer<typeof QuizCreationSchema>;

const QuizCreation = ({ topic }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [finished, setFinished] = useState(false);

  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({ count, topic, type }: InputForm) => {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count, topic, type }),
      });
      const data = await res.json();
      return data;
    },
    onError: (error: any) => {
      toast.error(`Error creating quiz: ${error.message}`);
    }
  });

  const form = useForm<InputForm>({
    resolver: zodResolver(QuizCreationSchema),
    defaultValues: {
      count: 3,
      topic: topic || "",
      type: "open_ended",
    },
  });

  function onSubmit(data: InputForm) {
    setShowLoader(true);
    getQuestions(data, {
      onSuccess: ({ gameId }) => {
        setFinished(true);
        setTimeout(() => {
          toast.success("Quiz created successfully!");
          router.push(`/play/${form.getValues("type")}/${gameId}`);
        }, 1000);
      },
      onError: (error) => {
        toast.error("Failed to create quiz. Please try again.");
        setShowLoader(false);
      },
    });
  }

  if (showLoader) {
    return <LoadingQuestions finished={finished} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-100">
        <CardHeader>
          <CardTitle>Create a New Quiz</CardTitle>
          <CardDescription>Choose a topic for your quiz</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter topic" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter a topic for your quiz between 4 and 50
                      characters.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter number of questions"
                        type="number"
                        min={3}
                        max={10}
                        {...field}
                        onChange={(e) =>
                          form.setValue("count", parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a number of questions between 1 and 10.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select quiz type" />
                        </SelectTrigger>
                        <SelectContent
                          align="center"
                          position="item-aligned"
                          sideOffset={5}
                        >
                          <SelectGroup>
                            <SelectLabel>Quiz Types</SelectLabel>
                            <SelectItem value="multiple_choice">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="true_false">
                              True/False
                            </SelectItem>
                            <SelectItem value="open_ended">
                              Open Ended
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the type of quiz you want to create.{" "}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isPending}
              >
                Submit
                {isPending && <Loader className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
