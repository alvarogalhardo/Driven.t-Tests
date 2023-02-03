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

export async function createRooms() {
  return prisma.room.createMany({
    data: [
      {
        hotelId: 1,
        name: faker.lorem.word(2),
        capacity: 1,
      },
      {
        hotelId: 1,
        name: faker.lorem.word(2),
        capacity: 1,
      },
      {
        hotelId: 1,
        name: faker.lorem.word(2),
        capacity: 1,
      },
      {
        hotelId: 2,
        name: faker.lorem.word(2),
        capacity: 1,
      },
      {
        hotelId: 2,
        name: faker.lorem.word(2),
        capacity: 1,
      },
      {
        hotelId: 2,
        name: faker.lorem.word(2),
        capacity: 1,
      },
      {
        hotelId: 3,
        name: faker.lorem.word(2),
        capacity: 1,
      },
      {
        hotelId: 3,
        name: faker.lorem.word(2),
        capacity: 1,
      },
      {
        hotelId: 3,
        name: faker.lorem.word(2),
        capacity: 1,
      },
    ],
  });
}
