import bcrypt from "bcrypt";
import dotenv from "dotenv";
import logger from "./logger";
import jwt from "jsonwebtoken";

dotenv.config();

interface payload {
    userid: string,
    email: string
}

// Password Hash Fuction using bcryptjs
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10; //Default saltRound 
    const hash = await bcrypt.hash(password, saltRounds); // hash Password 
    console.log("Hashing password...");

    return hash;
}

// Token generation usin jswonwebtoken
const SECRET = process.env.JWT_SECRET
export const generateToken = async (payload: object) => {
    if (!SECRET) {
        ("Missing Envirnoment variable SECRET KEY");
        throw new Error("Missing Envirnoment variable SECRET KEY");
    }
    const token = jwt.sign(payload, SECRET, { expiresIn: '30m' });
    console.log("Token genrated")
    return token;
}




