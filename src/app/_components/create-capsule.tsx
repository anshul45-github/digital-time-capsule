// TODO: Essentially replace this with a shadcn component for creating a capsule


// import { useForm } from "react-hook-form";
// import { trpc } from "../../utils/trpc";

// type CapsuleFormData = {
//   contentHash: string;
//   caption: string;
//   tags: string; // comma-separated
//   location?: string;
//   finalUnlockTime: string;
//   earlyUnlockDates: string; // comma-separated dates
//   humanLimit: number;
//   guardianId?: string;
//   badgeRequirement: number;
// };

// const CreateCapsule = () => {
//   const { register, handleSubmit } = useForm<CapsuleFormData>();
//   const createCapsule = trpc.capsule.createCapsule.useMutation();

//   const onSubmit = (data: CapsuleFormData) => {
//     // Convert comma-separated fields into arrays and dates to Date objects
//     createCapsule.mutate({
//       contentHash: data.contentHash,
//       caption: data.caption,
//       tags: data.tags.split(",").map(tag => tag.trim()),
//       location: data.location,
//       finalUnlockTime: new Date(data.finalUnlockTime),
//       earlyUnlockDates: data.earlyUnlockDates.split(",").map(d => new Date(d)),
//       humanLimit: data.humanLimit,
//       guardianId: data.guardianId,
//       badgeRequirement: data.badgeRequirement,
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input placeholder="Content Hash" {...register("contentHash")} required />
//       <input placeholder="Caption" {...register("caption")} required />
//       <input placeholder="Tags (comma separated)" {...register("tags")} required />
//       <input placeholder="Location (optional)" {...register("location")} />
//       <input type="datetime-local" {...register("finalUnlockTime")} required />
//       <input placeholder="Early Unlock Dates (comma separated)" {...register("earlyUnlockDates")} required />
//       <input type="number" placeholder="Human Limit" {...register("humanLimit")} required />
//       <input placeholder="Guardian ID (optional)" {...register("guardianId")} />
//       <input type="number" placeholder="Badge Requirement" {...register("badgeRequirement")} required />
//       <button type="submit">Create Capsule</button>
//     </form>
//   );
// };

// export default CreateCapsule;
