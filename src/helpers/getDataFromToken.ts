import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        
        const token = request.cookies.get("token")?.value;

        if (!token) {
            throw new Error("Token not provided");
        }

       
        const decodedToken: any = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        );

       
        if (!decodedToken.id) {
            throw new Error("Invalid token");
        }

        console.log("Decoded Token:", decodedToken);
        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
