
import { http, HttpResponse } from 'msw';
import { db } from './db';


const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const handlers = [
  // UPDATED handler to support filtering and pagination
  http.get('/jobs', async ({ request }) => {
    try {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
      
      // Get filter params from the URL
      const search = url.searchParams.get('search') || '';
      const status = url.searchParams.get('status') || 'all';
      const tags = url.searchParams.get('tags') || '';

      const allJobs = await db.jobs.toArray();

      // Applying filters
      const filteredJobs = allJobs.filter(job => {
        // Status of filter
        if (status !== 'all' && job.status !== status) {
          return false;
        }
        // Search filter (case-insensitive)
        if (search && !job.title.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        // Tags filter (case-insensitive, checks if at least one job tag includes the search tag)
        if (tags && !job.tags.some(tag => tag.toLowerCase().includes(tags.toLowerCase()))) {
          return false;
        }
        return true;
      });

      const totalCount = filteredJobs.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedJobs = filteredJobs.slice(start, end);

      await delay(300); // A little delay to simulate network latency

      return HttpResponse.json({
        jobs: paginatedJobs,
        totalCount: totalCount,
      });

    } catch (error) {
      console.error("Error fetching jobs from Dexie:", error);
      return HttpResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
    }
  }),
];