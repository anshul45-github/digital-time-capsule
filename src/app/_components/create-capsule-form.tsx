"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DottedSeparator } from "./dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateCapsuleFormProps {
    onClose?: () => void;
}

export const CreateCapsuleFormSchema = z.object({
    title: z.string().min(1, "Required"),
    caption: z.string(),
    mediaUrl: z.union([
        z.instanceof(File),
        z.string().transform((val) => val === "" ? undefined : val)
    ]),
    mediaType: z.string(),
    coverImgUrl: z.union([
        z.instanceof(File),
        z.string().transform((val) => val === "" ? undefined : val)
    ]),
    tags: z.string(),
    isPublic: z.boolean(),
    finalUnlockTime: z.coerce.date()
})

export const CreateCapsuleForm = ({ onClose }: CreateCapsuleFormProps) => {
    const form = useForm<z.infer<typeof CreateCapsuleFormSchema>>({
        defaultValues: {
            title: "",
            caption: "",
            mediaUrl: "",
            mediaType: "",
            coverImgUrl: "",
            tags: "",
            isPublic: false,
            finalUnlockTime: new Date()
        },
    });

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof CreateCapsuleFormSchema>) => {
        try {
            const res = await post("/api/capsules", values);
            toast.success("Capsule created successfully");
            console.log(res);
        } catch (error) {
            toast.error("Failed to create capsule");
        }
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new capsule
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Title
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter capsule title" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="caption" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Caption
                                </FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Enter capsule caption" />
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

function post(arg0: string, data: { title: string; caption: string; mediaType: string; tags: string; isPublic: boolean; finalUnlockTime: Date; mediaUrl?: string | File | undefined; coverImgUrl?: string | File | undefined; }) {
    throw new Error("Function not implemented.");
}
