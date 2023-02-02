import { notFoundError } from '@/errors';
import { Hotel, Room, Booking } from '@prisma/client';
import hotelRepository from '@/repositories/hotels-repository';




const hotelsService = {};

export default hotelsService