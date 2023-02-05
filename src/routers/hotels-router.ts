import { getAllHotels, getHotelById } from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const hotelsRouter = Router();

hotelsRouter
    .all('/*', authenticateToken)
    .get('/',getAllHotels)
    .get('/:hotelId',getHotelById);

export default hotelsRouter;
