import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import hotelsService from "@/services/hotels-service";

export async function getAllHotels(req:AuthenticatedRequest,res:Response){
    try{

    }catch(err){
        console.error(err);
        return res.sendStatus(httpStatus.NO_CONTENT);
    }
}