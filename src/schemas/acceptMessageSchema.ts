import { z } from "zod";

export const acceptMessegeSchema = z.object({
    acceptMessage:z.boolean()
})