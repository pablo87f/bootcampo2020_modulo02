import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/cancellation-mail.job';
import redisConfig from '../config/redis.config';

const jobs = [CancellationMail];

class Queue {
    constructor() {
        console.log('queue constructor');
        this.queues = {};
        this.init();
    }

    init() {
        console.log('queue init');

        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    add(key, jobData) {
        console.log('queue add');
        return this.queues[key].bee.createJob(jobData).save();
    }

    processQueue() {
        console.log('queue processQueue');
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];
            bee.process(handle);
        });
    }
}

export default new Queue();
