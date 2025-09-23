import { http, HttpResponse } from 'msw';
import { db } from './db';
 import { faker } from '@faker-js/faker';
// Helper function for artificial delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const handlers = [
  // Handler for GET /jobs
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
      return HttpResponse.json({ jobs: paginatedJobs, totalCount: totalCount });
    } catch (error) {
      console.error("Error fetching jobs from Dexie:", error);
      return HttpResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
    }
  }),

  // Handler for POST /jobs
  http.post('/jobs', async ({ request }) => {
    try {
      const newJobData = await request.json();
      if (!newJobData.title) return HttpResponse.json({ message: 'Title is required' }, { status: 400 });
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

  // Handler for PATCH /jobs/:id
  http.patch('/jobs/:id', async ({ request, params }) => {
    try {
      const jobId = parseInt(params.id);
      const updates = await request.json();
      if (updates.title) updates.slug = updates.title.toLowerCase().replace(/\s+/g, '-');
      await db.jobs.update(jobId, updates);
      const updatedJob = await db.jobs.get(jobId);
      return HttpResponse.json(updatedJob);
    } catch (error) {
      console.error("Error updating job:", error);
      return HttpResponse.json({ message: 'Failed to update job' }, { status: 500 });
    }
  }),
  
  // Handler for GET /jobs/:id
  http.get('/jobs/:id', async ({ params }) => {
    try {
      const jobId = parseInt(params.id);
      const job = await db.jobs.get(jobId);
      if (job) return HttpResponse.json(job);
      else return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    } catch (error) {
      console.error("Error fetching single job:", error);
      return HttpResponse.json({ message: 'Failed to fetch job' }, { status: 500 });
    }
  }),
  
  // Handler for PATCH /jobs/reorder
  http.patch('/jobs/reorder', async ({ request }) => {
    if (Math.random() < 0.2) {
      console.log("API: Simulating a server error for reorder.");
      await delay(500);
      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    }
    try {
      const { jobsToUpdate } = await request.json();
      const promises = jobsToUpdate.map(job =>
        db.jobs.update(parseInt(job.id), { order: job.order })
      );
      await Promise.all(promises);
      return HttpResponse.json({ success: true });
    } catch (error) {
      console.error("Error reordering jobs:", error);
      return HttpResponse.json({ message: 'Failed to reorder jobs' }, { status: 500 });
    }
  }),

  // Handles GET /candidates request
http.get('/candidates', async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || 'all';

    const allCandidates = await db.candidates.toArray();

    const filteredCandidates = allCandidates.filter(candidate => {
      // Stage filter
      if (stage !== 'all' && candidate.stage !== stage) {
        return false;
      }
      // Search filter (name or email, case-insensitive)
      if (search && 
          !candidate.name.toLowerCase().includes(search.toLowerCase()) && 
          !candidate.email.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });

    const totalCount = filteredCandidates.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCandidates = filteredCandidates.slice(start, end);

    await delay(300);

    return HttpResponse.json({
      candidates: paginatedCandidates,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return HttpResponse.json({ message: 'Failed to fetch candidates' }, { status: 500 });
  }
}),

// Handles updating a candidate (e.g., changing their stage)
http.patch('/candidates/:id', async ({ request, params }) => {
  try {
    const candidateId = parseInt(params.id);
    const updates = await request.json();
    
    await db.candidates.update(candidateId, updates);
    const updatedCandidate = await db.candidates.get(candidateId);

    return HttpResponse.json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return HttpResponse.json({ message: 'Failed to update candidate' }, { status: 500 });
  }
}),

// Handles GET /candidates/:id to fetch a single candidate's details
http.get('/candidates/:id', async ({ params }) => {
  try {
    const candidateId = parseInt(params.id);
    const candidate = await db.candidates.get(candidateId);
    return candidate
      ? HttpResponse.json(candidate)
      : HttpResponse.json({ message: 'Candidate not found' }, { status: 404 });
  } catch (error) {
    return HttpResponse.json({ message: 'Failed to fetch candidate' }, { status: 500 });
  }
}),

// Handles GET /candidates/:id/timeline to generate fake timeline data
http.get('/candidates/:id/timeline', async ({ params }) => {
  // Since we don't store history, we'll generate a fake timeline
  const stages = ["applied", "screen", "tech", "offer"];
  const timeline = [];
  for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
    timeline.push({
      stage: stages[i],
      date: faker.date.past({ years: 1 }),
      notes: faker.lorem.sentence(),
    });
  }
  await delay(200); // simulate network latency
  return HttpResponse.json(timeline.sort((a, b) => a.date - b.date));
}),


// Handles GET /candidates/:id/notes
http.get('/candidates/:id/notes', async ({ params }) => {
  const candidateId = parseInt(params.id);
  // Get notes for the specific candidate and sort by newest first
  const notes = await db.notes
    .where('candidateId')
    .equals(candidateId)
    .reverse()
    .sortBy('createdAt');
  return HttpResponse.json(notes);
}),

// Handles POST /candidates/:id/notes
http.post('/candidates/:id/notes', async ({ request, params }) => {
  const candidateId = parseInt(params.id);
  const { text } = await request.json();

  const noteToSave = {
    candidateId,
    text,
    createdAt: new Date(),
  };

  const newId = await db.notes.add(noteToSave);
  const newNote = await db.notes.get(newId);
  return HttpResponse.json(newNote, { status: 201 });
}),


];