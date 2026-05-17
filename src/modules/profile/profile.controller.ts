import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async(req:Request,res:Response)=>{
    try{
        const result = await profileService.createProfileIntoDB(req.body)
        res.status(201).json({
            success: true,
            message: "Profile Created",
            data: result.rows[0]
        })
    }catch(error:any){
        res.status(500).json({
            message: error.message,
            error: error
        })

}
}
const getAllProfileData = async(req:Request,res:Response)=>{
    try{
        const result = await profileService.getAllProfileDataFromDB();
        res.status(200).json({
            message: "data retrieved successfully",
            data: result.rows
        })

    }catch(error:any){
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
}
const getSingleProfileData =async(req:Request,res:Response)=>{
    const {id} =req.params
    const result = await profileService.getSingleProfileFromDB(id as string);
    res.status(201).json({
        message: 'Data retrieved successfully',
        data: result.rows[0]
    })
}
export const profileController ={
    createProfile,
    getAllProfileData,
    getSingleProfileData
}