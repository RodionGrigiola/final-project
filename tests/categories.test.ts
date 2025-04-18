require("dotenv/config");
import request from 'supertest';
import app from '../src/app'; 
import { setupTestDB } from './setup';

setupTestDB()

describe('Category Routes', () => {
    describe('GET /', () => {
      it('Should get first page (5 items)', async () => {
        const res = await request(app)
          .get('/furnitureCategory')
          .expect(200);

          expect(res.body.result.items.length).toBe(10)
      })
    })

    describe('GET /:id', () => {
      it('Should get item by id', async () => {
        const res = await request(app)
          .get('/furnitureCategory/6802a29dfdd6cb6055e7f3fa')
          .expect(200);
      })
    })
})