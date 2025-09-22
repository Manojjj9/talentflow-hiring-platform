
import { http, HttpResponse } from 'msw';
import { db } from './db';


const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const handlers = [
  
  http.get('/jobs', async ({ request }) => {
    console.log("MSW /jobs handler was called with URL:", request.url);
    try {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

      const allJobs = await db.jobs.toArray();
      const totalCount = allJobs.length;

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedJobs = allJobs.slice(start, end);

      await delay(Math.random() * 500 + 100); // Shorter delay for pagination

      return HttpResponse.json({
        jobs: paginatedJobs,
        totalCount: totalCount,
      });

    } catch (error) {
      console.error("Error fetching jobs from Dexie:", error);
      return HttpResponse.json(
        { message: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }
  }),
];