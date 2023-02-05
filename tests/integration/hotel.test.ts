import app, { close, init } from '@/app';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createHotel,
  createHotels,
  createRemoteTicketType,
  createRooms,
  createTicket,
  createTicketType,
  createTicketTypeWithoutHotel,
  createUser,
  createValidTicketType,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';

beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await close();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = 'esteToKenÉinvalido';
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status code 404 if there are no enrollments tied with userId', async () => {
      const token = await generateValidToken();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status code 404 if there are no tickets tied with enrollmentId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it("should respond with status code 402 if the ticket wasn't paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, 'RESERVED');
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status code 402 if the ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it("should respond with status code 402 if the ticket doesn't include hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status code 200 and return all hotels', async () => {
      await createHotels();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

describe("GET '/hotels/:hotelId", () => {
  it('should respond with status 401 if no token is given', async () => {
    const hotel = await createHotel();
    const response = await server.get(`/hotels/${hotel.id}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const hotel = await createHotel();
    const token = 'esteToKenÉinvalido';
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const hotel = await createHotel();
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status code 404 if there are no enrollments tied with userId', async () => {
      const hotel = await createHotel();
      const token = await generateValidToken();
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status code 404 if there are no tickets tied with enrollmentId', async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it("should respond with status code 402 if the ticket wasn't paid", async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, 'RESERVED');
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status code 402 if the ticket is remote', async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it("should respond with status code 402 if the ticket doesn't include hotel", async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status code 200 and return the hotel', async () => {
      const hotel = await createHotel();
      await createRooms(hotel.id);
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
    });
  });
});
