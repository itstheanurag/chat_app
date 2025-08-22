import { chatSchema } from "types"

export const createChat = async ( req: Request, res: Response ) => {
    const parsedChatData = chatSchema.safeParse(req.body);
    
} 