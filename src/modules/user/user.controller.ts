import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    res.status(200).json({
      message: "Data is created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log(error);
    res.status(404).json({
      message: error.message,
      error: error,
    });
  }
};
const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();

    res.status(200).json({
      message: "Data retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data Not Found",
        data: null,
      });
    }
    res.status(200).json({
      message: "Data retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
      error: error,
    });
  }
};
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {

    const result = await userService.updateUserIntoDB(id as string,req.body)

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data Not Found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Update successful",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const deleteUser=async(req:Request,res:Response)=>{
    const {id} = req.params;
  try{
    const result =await userService.deleteUserFromDB(id as string);

      if(result.rowCount === 0){
        res.status(404).json({
          success: false,
          message: "User not found"
        })
      }
      res.status(200).json({
        success: true,
        message: "Successfully deleted"
      })
  }catch(error:any){
    res.status(500).json({
      message: error.message,
      error: error
    })
  }
}
export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
};
