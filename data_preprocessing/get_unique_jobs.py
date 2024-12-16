
with open('industry/unique_job_titles.csv', 'r') as f:
    all_jobs = f.read().splitlines()

set_jobs = set(job.split(',')[0] for job in all_jobs)
def extract_job_title(job):
    if job.count('"') >= 2:
        return job.split('"')[1]
    else:
        return job.split(',')[0]

unique_jobs = sorted(list(set(extract_job_title(job) for job in all_jobs)))
print(unique_jobs)
print(len(unique_jobs))