"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { DottedSeparator } from "~/app/_components/dotted-separator";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import axios from 'axios';

interface CreateCommunityFormProps {
    onClose?: () => void;
}

export const CreateCommunityFormSchema = z.object({
    title: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
})

export const CreateCommunityForm = ({ onClose }: CreateCommunityFormProps) => {
    const form = useForm<z.infer<typeof CreateCommunityFormSchema>>({
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof CreateCommunityFormSchema>) => {
        try {
            const res = await axios.post("/api/community", values);
            toast.success("Community created successfully");
            onClose && onClose();
            router.push(`/community/${res.data.id}`)
        } catch (error) {
            toast.error("Failed to create community");
        }
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new community
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <CardTitle></CardTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Title
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter community name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Enter community description" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        </div>
                        <DottedSeparator />
                        <div className="flex items-center justify-between">
                            <Button type="button" variant={"secondary"} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" size={"lg"}>
                                Create Capsule
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
