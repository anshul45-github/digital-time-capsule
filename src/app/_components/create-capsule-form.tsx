"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DottedSeparator } from "./dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useState } from "react";
import { X } from "lucide-react";
import { api } from "~/trpc/react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface CreateCapsuleFormProps {
    onClose?: () => void;
}

export const CreateCapsuleFormSchema = z.object({
    title: z.string().min(1, "Required"),
    caption: z.string(),
    mediaUrl: z.union([
        z.instanceof(File),
        z.string().transform((val) => val === "" ? undefined : val)
    ]).optional(),
    mediaType: z.enum(["IMAGE", "TEXT", "VIDEO", "AUDIO"]),
    coverImgUrl: z.union([
        z.instanceof(File),
        z.string().transform((val) => val === "" ? undefined : val)
    ]).optional(),
    tags: z.array(z.string()),
    isPublic: z.boolean(),
    finalUnlockTime: z.coerce.date(),
    openThreshold: z.number().optional(),
    locationRegion: z.string().optional(),
    memoryGuardianId: z.string().optional(),
    transferable: z.boolean()
});

export const CreateCapsuleForm = ({ onClose }: CreateCapsuleFormProps) => {
    const form = useForm<z.infer<typeof CreateCapsuleFormSchema>>({
        defaultValues: {
            title: "",
            caption: "",
            mediaUrl: "",
            mediaType: undefined,
            coverImgUrl: "",
            tags: [],
            isPublic: false,
            finalUnlockTime: new Date(),
            openThreshold: undefined,
            locationRegion: "",
            memoryGuardianId: "",
            transferable: false
        },
    });

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const Wallet = useWallet()

    const makeCapNFT = api.aptos.nft.createCapsule.useMutation();
    const createCap = api.capsule.createCapsule.useMutation();

    const handleAddTag = () => {
        if (tagInput.trim() !== "") {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof CreateCapsuleFormSchema>) => {
        try {
            if (!Wallet.connected) {
                return toast.error("Please connect your wallet to create a capsule");
            }

            let mediaUrl = values.mediaUrl;

            if (values.mediaType !== "TEXT" && values.mediaUrl instanceof File) {
                const formData = new FormData();
                formData.append("file", values.mediaUrl);
                formData.append("upload_preset", "your_preset");

                const response = await axios.post("/api/upload", formData);
                mediaUrl = response.data.url;
            } else if (values.mediaType === "TEXT" && typeof values.mediaUrl === "string") {
                const textBlob = new Blob([values.mediaUrl], { type: "text/plain" });
                const formData = new FormData();
                formData.append("file", textBlob);
                formData.append("upload_preset", "your_preset");

                const response = await axios.post("/api/upload", formData);
                mediaUrl = response.data.url;
            }

            // const res = await post("/api/capsules", { ...values, mediaUrl, tags, caption: values.caption || "" });
            const NFTRes = makeCapNFT.mutate({
                walletAccount: Wallet.wallet?.accounts[0],
                mediaPointer: mediaUrl,
                caption: values.caption,
                newCollection: true,
                userId: Wallet.account.accountAddress,
            })
            
            toast.success("Capsule created successfully");
            console.log(res);
        } catch (error) {
            toast.error("Failed to create capsule");
        }
    };

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
                                    Title <span className="text-red-500">*</span>
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
                                    Caption <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Enter capsule caption" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="mediaType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Media Type <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select media type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IMAGE">Image</SelectItem>
                                            <SelectItem value="TEXT">Text</SelectItem>
                                            <SelectItem value="VIDEO">Video</SelectItem>
                                            <SelectItem value="AUDIO">Audio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {form.watch("mediaType") === "TEXT" ? (
                            <FormField control={form.control} name="mediaUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Text Content <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={typeof field.value === 'string' ? field.value : ''} placeholder="Enter text content" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        ) : (
                            <FormField control={form.control} name="mediaUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Upload File <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} onBlur={field.onBlur} name={field.name} ref={field.ref} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}
                        <FormField control={form.control} name="tags" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Tags <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tags.map((tag, index) => (
                                                <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600 flex items-center gap-2">
                                                    {tag}
                                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-gray-700">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Enter tag" />
                                            <Button type="button" onClick={handleAddTag}>Add Tag</Button>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isPublic" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pr-3">
                                    Public <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Checkbox />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="finalUnlockTime" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Final Unlock Date <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="openThreshold" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Open Threshold
                                </FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value ?? ""} placeholder="Enter open threshold" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="locationRegion" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Location Region
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter location region" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="memoryGuardianId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Memory Guardian ID
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter memory guardian ID" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="transferable" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pr-3">
                                    Transferable <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
    );
};
