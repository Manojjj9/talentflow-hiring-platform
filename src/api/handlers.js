import { http, HttpResponse } from 'msw';
import { db } from './db';

// Helper function for artificial delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const handlers = [
  // Handler for GET /jobs (with filtering and pagination)
  http.get('/jobs', async ({ request }) => {
    try {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

      const search = url.searchParams.get('search') || '';
      const status = url.searchParams.get('status') || 'all';
      const tags = url.searchParams.get('tags') || '';

      const allJobs = await db.jobs.toArray();

      const filteredJobs = allJobs.filter(job => {
        if (status !== 'all' && job.status !== status) return false;
        if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (tags && !job.tags.some(tag => tag.toLowerCase().includes(tags.toLowerCase()))) return false;
        return true;
      });

      const totalCount = filteredJobs.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedJobs = filteredJobs.slice(start, end);

      await delay(300);

      return HttpResponse.json({
        jobs: paginatedJobs,
        totalCount: totalCount,
      });

    } catch (error) {
      console.error("Error fetching jobs from Dexie:", error);
      return HttpResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
    }
  }),

  // Handler for POST /jobs
  http.post('/jobs', async ({ request }) => {
    try {
      const newJobData = await request.json();

      if (!newJobData.title) {
        return HttpResponse.json({ message: 'Title is required' }, { status: 400 });
      }

      const allJobs = await db.jobs.toArray();
      const newOrder = allJobs.length > 0 ? Math.max(...allJobs.map(j => j.order)) + 1 : 0;

      const jobToSave = {
        title: newJobData.title,
        slug: newJobData.title.toLowerCase().replace(/\s+/g, '-'),
        tags: newJobData.tags,
        status: 'active',
        order: newOrder,
      };

      const newId = await db.jobs.add(jobToSave);
      const createdJob = await db.jobs.get(newId);

      return HttpResponse.json(createdJob, { status: 201 });

    } catch (error) {
      console.error("Error creating job:", error);
      return HttpResponse.json({ message: 'Failed to create job' }, { status: 500 });
    }
  }),



  // Handles a PATCH /jobs/:id request
  http.patch('/jobs/:id', async ({ request, params }) => {
    try {
      const jobId = parseInt(params.id);
      const updates = await request.json();

      if (updates.title) {
        updates.slug = updates.title.toLowerCase().replace(/\s+/g, '-');
      }

      await db.jobs.update(jobId, updates);
      const updatedJob = await db.jobs.get(jobId);

      return HttpResponse.json(updatedJob);
    } catch (error) {
      console.error("Error updating job:", error);
      return HttpResponse.json({ message: 'Failed to update job' }, { status: 500 });
    }
  }),

  // Handles a GET /jobs/:id request
  http.get('/jobs/:id', async ({ params }) => {
    try {
      const jobId = parseInt(params.id);
      const job = await db.jobs.get(jobId);

      if (job) {
        return HttpResponse.json(job);
      } else {
        return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
      }
    } catch (error) {
      console.error("Error fetching single job:", error);
      return HttpResponse.json({ message: 'Failed to fetch job' }, { status: 500 });
    }
  }),

];