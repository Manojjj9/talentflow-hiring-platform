import { rest } from 'msw';
import { db } from './db';

export const handlers = [
  
  rest.get('/jobs', async (req, res, ctx) => {
    try {
      const jobs = await db.jobs.toArray();
      
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200));

      return res(
        ctx.status(200),
        ctx.json(jobs)
      );
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Failed to fetch jobs' })
      );
    }
  }),
];