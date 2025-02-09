# Load Testing Tool

This is a highly scalable and efficient load testing tool built with Node.js, Express, worker threads, and clustering. It allows you to perform load tests on any API by simulating a high number of concurrent requests, leveraging both worker threads and clusters to maximize performance.

## Features

- **Scalable**: Dynamically spawns worker threads and cluster workers to utilize all available CPU cores.
- **Concurrency Control**: Configurable number of concurrent requests per worker for fine-tuned load simulation.
- **Efficient Request Execution**: Distributes load evenly across multiple worker threads.
- **Job Management**: Track the status of load test jobs, including success, failure, and error reports.
- **Easy to Use**: Simple REST API for initiating load tests.

## Installation

### Prerequisites

- **Node.js**: Version 16.x or higher.
- **npm** (Node Package Manager)

### Steps to Install

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/load-testing-tool.git
   cd load-testing-tool
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

### API usage

#### POST /load-test

This endpoint allows you to initiate a load test for a given API.

##### Request Body

```json
{
  "url": "http://example.com/api", // The API URL to load test
  "method": "GET", // The HTTP method (default is 'GET')
  "headers": {}, // Optional custom headers for the request
  "body": {}, // Optional body for POST/PUT requests
  "requests": 100, // Total number of requests to simulate (default is 100)
  "concurrency": 10 // Number of concurrent requests per worker (default is 10)
}
```

##### Response

```json
{
  "jobId": "uuid" // The unique job ID for tracking the test
}
```

Once you submit a load test request, the system will begin executing the test in parallel using worker threads and cluster workers.

### Check Job Status

You can check the status of a load test job by querying the job ID returned when the load test was initiated.

```bash
GET /job-status/:jobId
```

##### Example

```
GET /job-status/123e4567-e89b-12d3-a456-426614174000
```

##### Response

```json
{
  "status": "completed", // Possible values: 'in-progress', 'completed', 'failed'
  "results": {
    // Only available if status is 'completed'
    "totalRequests": 100,
    "success": 90,
    "failure": 10,
    "errors": ["Error message"]
  },
  "error": null // Only available if status is 'failed'
}
```

# How It Works

## Cluster and Worker Threads

This tool leverages Node.js's `cluster` module to spawn multiple processes, each running on a separate CPU core. Each worker process is responsible for a portion of the load test, distributing the load across the available system resources.

Additionally, within each worker process, Node.js's `worker_threads` module is utilized to manage concurrency and execute multiple HTTP requests simultaneously. This helps in simulating high loads while maintaining control over the number of requests.

### Key Concepts:

- **Cluster**: The `cluster` module spawns worker processes based on the number of available CPU cores on the machine. This ensures that the system's resources are fully utilized for parallel request execution.
- **Worker Threads**: Each worker process further uses `worker_threads` to handle multiple requests concurrently. This enables fine-grained control over the number of requests each worker thread handles, simulating high levels of concurrency for a realistic load test.

## Scalability

- **Dynamic Load Distribution**: The load test is dynamically split across both cluster workers and worker threads. This ensures that the system efficiently utilizes all available resources, providing scalable load testing capabilities.
- **Concurrency Control**: You can configure the number of concurrent requests per worker thread, allowing you to simulate various levels of API load based on your test requirements.

## Worker Life Cycle

- **In-Progress**: When a load test is running, the worker processes are actively executing HTTP requests. You can track the status of the test using job IDs.

- **Completed**: Once the load test finishes, the results are returned. The test completion status will include success/failure counts, total requests, and any errors encountered.

- **Failed**: If an error occurs during the load test, either from a worker or during communication with the API, the job status will be marked as "failed," and relevant error details will be provided.

---

By utilizing both clusters and worker threads, this load testing tool offers a highly scalable and efficient solution for simulating API traffic under various conditions.
