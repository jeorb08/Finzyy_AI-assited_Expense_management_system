// using zod for create schema
// this schema used me
import * as zod from "zod";
export const accountSchema = zod.z.object({
    name: zod.z.string().min(1, "Name is required"),
    type: zod.z.enum(['CURRENT', 'SAVINGS']),
    balance: zod.z.string().min(1, "Initial Balance is required"),
    isDefault: zod.z.boolean().default(false),
})