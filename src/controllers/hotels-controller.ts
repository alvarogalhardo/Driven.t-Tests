import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import httpStatus from 'http-status';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const valid = await hotelsService.validateHotels(userId);
    console.log(valid)
    if (!valid) return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    const hotels = await hotelsService.getHotels();
    if (hotels.length === 0) return res.sendStatus(httpStatus.NO_CONTENT);
    return res.status(200).send(hotels);
  } catch (err) {
    console.error(err);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const valid = await hotelsService.validateHotels(userId);
    if (!valid) return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    const hotel = await hotelsService.getHotel(Number(id));
    if (!hotel) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(200).send(hotel);
  } catch (err) {
    console.error(err);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
