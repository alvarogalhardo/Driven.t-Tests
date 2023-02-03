import { prisma } from '@/config';

async function getAllHotels() {
  return await prisma.hotel.findMany();
}

async function getHotelById(id: number) {
  return await prisma.hotel.findUnique({
    where: {
      id,
    },
    include: {
      Rooms: {
        select: {
          id: true,
          name: true,
          capacity: true,
          hotelId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

async function checkEnrollment(userId: number) {
  return await prisma.enrollment.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });
}

async function checkTicket(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    select: {
      status: true,
      ticketTypeId: true,
    },
  });
}

async function checkTicketType(ticketTypeId: number) {
  return await prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId,
    },
    select: {
      isRemote: true,
      includesHotel: true,
    },
  });
}

const hotelRepository = {
  getAllHotels,
  getHotelById,
  checkEnrollment,
  checkTicket,
  checkTicketType,
};

export default hotelRepository;
