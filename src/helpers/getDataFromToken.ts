import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface TokenPayload {
    id: string;
    // Add other properties if needed, e.g., email, role, etc.
}

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            throw new Error("Token not provided");
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;

        if (!decodedToken.id) {
            throw new Error("Invalid token");
        }

        console.log("Decoded Token:", decodedToken);
        return decodedToken.id;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};
