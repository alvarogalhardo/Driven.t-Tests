import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import httpStatus from 'http-status';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const valid = await hotelsService.validateHotels(userId);
    if (!valid) return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    const hotels = await hotelsService.getHotels();    
    return res.status(200).send(hotels);
  } catch (err) {
    console.error(err);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  const userId = req.userId;
  try {
    const valid = await hotelsService.validateHotels(userId);
    if (!valid) return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    const hotel = await hotelsService.getHotel(parseInt(hotelId));
    if (!hotel) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(200).send(hotel);
  } catch (err) {
    console.error(err);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
