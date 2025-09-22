import Dexie from 'dexie';
import { faker } from '@faker-js/faker';

export const db = new Dexie('talentflowDB');


db.version(1).stores({
  jobs: '++id, title, slug, status, *tags, order',
  candidates: '++id, name, email, stage, jobId',
  assessments: '++id, jobId',
});


export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  
  if (jobCount === 0) {
    console.log("Database is empty, seeding...");
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
  } else {
    console.log("Database already contains data, skipping seed.");
  }
}