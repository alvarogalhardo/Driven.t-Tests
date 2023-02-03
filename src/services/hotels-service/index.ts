import { notFoundError } from '@/errors';
import { Hotel, Room, Booking } from '@prisma/client';
import hotelRepository from '@/repositories/hotels-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getHotels() {
  const data: Hotel[] = await hotelRepository.getAllHotels();
  return data;
}

async function getHotel(id: number) {
  const data = await hotelRepository.getHotelById(id);
  return data;
}

async function validateHotels(userId: number) {
  const enrollment = await hotelRepository.checkEnrollment(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await hotelRepository.checkTicket(enrollment.id);
  console.log(ticket,'ticket');
  
  if (ticket.status !== 'PAID') return false;
  const ticketType = await hotelRepository.checkTicketType(ticket.ticketTypeId);
  console.log(ticketType,'TT');
  
  if (!ticketType.includesHotel || ticketType.isRemote) return false;
  return true;
}

const hotelsService = {
  getHotels,
  getHotel,
  validateHotels,
};

export default hotelsService;
