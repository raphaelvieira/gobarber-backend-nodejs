import Bee from 'bee-queue';
import redisConfig from '../config/redis';
import CancellationMail from '../app/jobs/CancellationMail';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    // for each job store on the queue.
    jobs.forEach(({ key, handle }) => {
      // Key - key of Job(CancellationMail)
      // handle - Method that execute a job
      this.queues[key] = {
        // in a FIFO store the bee that connect with redis that get and set values on database
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle, // process the job
      };
    });
  }

  // add job to the queue
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // process the jobs on the queue
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.process(handle);
    });
  }
}

export default new Queue();
