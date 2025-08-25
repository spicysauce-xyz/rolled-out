# Scheduled Posts Queue System

This directory contains the Redis-based queue system for automatically publishing scheduled posts.

## Overview

The system uses BullMQ (Redis-based queue) to handle scheduled post publishing. When a post is scheduled via the `/schedule` endpoint, a background job is created that will automatically publish the post at the specified time.

## Components

### `redis.ts`
- Redis client connection
- Automatically connects on import

### `queue.ts`
- Queue service for managing scheduled post jobs
- Worker for processing scheduled posts
- Handles job creation, removal, and rescheduling

## Features

### Automatic Publishing
- Posts scheduled via the API are automatically published at the correct time
- Post status is updated to `published`
- `scheduledAt` and `scheduleJobId` fields are cleared after publishing

### Rescheduling
- When a scheduled post is rescheduled, the old job is removed and a new one is created
- Prevents duplicate jobs and ensures only the latest schedule is active

### Manual Publishing Override
- If a scheduled post is manually published or changed to draft, the scheduled job is automatically cancelled
- Prevents conflicts between manual and automatic publishing

### Error Handling
- Failed jobs are retried with exponential backoff
- Jobs are logged for monitoring and debugging
- Failed jobs are kept for investigation (10 most recent)

## Usage

### Starting the Worker

The worker is automatically started when the main API server starts. For production deployments, you can also run the worker separately:

```bash
pnpm worker
```

### Environment Variables

Required environment variables:
- `REDIS_URL`: Redis connection URL (e.g., `redis://localhost:6379`)
- `DATABASE_URL`: PostgreSQL connection URL

### Database Schema

The system requires a `schedule_job_id` field in the `post` table to track scheduled jobs. This is handled by migration `0018_known_tinkerer.sql`.

## API Endpoints

### Schedule a Post
```http
PUT /organizations/:organizationId/posts/:postId/schedule
Content-Type: application/json

{
  "scheduledAt": "2024-01-15T10:00:00Z"
}
```

### Publish a Post (cancels scheduling)
```http
POST /organizations/:organizationId/posts/:postId/publish
```

## Monitoring

The system logs important events:
- Job creation and scheduling
- Successful job completion
- Job failures and retries
- Worker startup and shutdown

Monitor Redis for queue health and job status using Redis CLI or monitoring tools.

## Error Recovery

If the worker goes down:
1. Restart the worker process
2. Existing scheduled jobs will continue to be processed
3. Jobs that were being processed during shutdown will be retried

If Redis goes down:
1. The API will continue to work but scheduling will fail
2. Restart Redis to restore queue functionality
3. Existing jobs in Redis will be preserved if Redis data is persisted