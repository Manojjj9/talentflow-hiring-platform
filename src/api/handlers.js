
import { http, HttpResponse } from 'msw';
import { db } from './db';


const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const handlers = [
  http.get('/jobs', async () => {
    try {
      const jobs = await db.jobs.toArray();
      await delay(Math.random() * 1000 + 200);
      return HttpResponse.json(jobs);
    } catch (error) {
      // THIS IS THE NEW LINE TO ADD
      console.error("Error fetching jobs from Dexie:", error); 
      
      return HttpResponse.json(
        { message: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }
  }),
];