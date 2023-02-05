import { prisma } from '@/config';
import faker from '@faker-js/faker';

export async function createHotels() {
  return prisma.hotel.createMany({
    data: [
      {
        name: faker.company.companyName(),
        image: faker.image.imageUrl(),
      },
      {
        name: faker.company.companyName(),
        image: faker.image.imageUrl(),
      },
      {
        name: faker.company.companyName(),
        image: faker.image.imageUrl(),
      },
    ],
  });
}

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRooms(hotelId: number) {
  return prisma.room.createMany({
    data: [
      {
        hotelId,
        name: faker.lorem.word(6),
        capacity: 1,
      },
      {
        hotelId,
        name: faker.lorem.word(6),
        capacity: 2,
      },
      {
        hotelId,
        name: faker.lorem.word(6),
        capacity: 3,
      },
    ],
  });
}
