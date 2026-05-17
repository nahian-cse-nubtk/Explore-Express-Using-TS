import { pool } from "../../db";

const createProfileIntoDB =async(payload:any)=>{
    const {user_id,bio,address,phone,gender}=payload;
    const user = await pool.query(`
        SELECT * FROM users WHERE id = $1
        `,[user_id])
        if(user.rows.length === 0){
            throw new Error("User not found");
        }

        const result = await pool.query(`
            INSERT INTO profile(user_id,bio,address,phone,gender) VALUES($1,$2,$3,$4,$5) RETURNING *
            `,[user_id,bio,address,phone,gender])

            return result;
}
const getAllProfileDataFromDB = async()=>{
    const result = await pool.query(`
        SELECT * FROM profile`)
        return result;
}
const getSingleProfileFromDB=async(id:string)=>{
    const result = await pool.query(`
        SELECT * FROM profile WHERE id =$1`,[id])
        return result;
}
export const profileService ={
    createProfileIntoDB,
    getAllProfileDataFromDB,
    getSingleProfileFromDB
}