
import Dexie from 'dexie';
import { faker } from '@faker-js/faker';

export const db = new Dexie('talentflowDB');

db.version(1).stores({
  jobs: '++id, title, slug, status, *tags, order',
  candidates: '++id, name, email, stage, jobId',
  assessments: '++id, jobId',
});

// function to seed both jobs and candidates
export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  const candidateCount = await db.candidates.count();

  // Seed Jobs if necessary
  if (jobCount === 0) {
    console.log("Seeding jobs...");
    const jobsToSeed = [];
    for (let i = 0; i < 25; i++) {
      const title = faker.person.jobTitle();
      jobsToSeed.push({
        title: title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        status: faker.helpers.arrayElement(['active', 'archived']),
        tags: [faker.person.jobArea(), faker.person.jobType()],
        order: i,
      });
    }
    await db.jobs.bulkAdd(jobsToSeed);
    console.log("Seeded 25 jobs.");
  }

  // Seed Candidates if necessary
  if (candidateCount === 0) {
    console.log("Seeding candidates...");
    const jobs = await db.jobs.toArray();
    const jobIds = jobs.map(j => j.id);
    const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
    const candidatesToSeed = [];

    for (let i = 0; i < 1000; i++) { 
      candidatesToSeed.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        jobId: faker.helpers.arrayElement(jobIds),
        stage: faker.helpers.arrayElement(stages),
      });
    }
    await db.candidates.bulkAdd(candidatesToSeed);
    console.log("Seeded 1000 candidates.");
  }

  if (jobCount > 0 && candidateCount > 0) {
    console.log("Database already contains data, skipping seed.");
  }
}