require("dotenv/config");
import request from 'supertest';
import app from '../src/app'; 
import { setupTestDB } from './setup';

setupTestDB();

describe('Items Routes', () => {
    describe('GET /', () => {
      it('Should get first page (5 items)', async () => {
        const res = await request(app)
          .get('/furniture?page=1')
          .expect(200);

          expect(res.body.result.page).toBe(1);
          expect(res.body.result.pageSize).toBe(5);
          expect(res.body.result.items.length).toBe(5);
      })
    })

    describe('GET /:id', () => {
      it('Should get item by id', async () => {
        const res = await request(app)
          .get('/furniture/6802a26314d81816041756d4')
          .expect(200);

          expect(res.body.item.id).toBe('6802a26314d81816041756d4');
      })
    })

    describe('GET /category/:categoryId', () => {
      it('Should get items by category id', async () => {
        const res = await request(app)
          .get('/furniture/category/6802a29dfdd6cb6055e7f3f6')
          .expect(200);
      })
    })
})
    
          
