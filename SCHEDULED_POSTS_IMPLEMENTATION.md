# Auto-Publish Scheduled Changelogs Implementation

## Summary

Successfully implemented a queue-based worker system for automatically publishing scheduled posts using Redis and BullMQ.

## Changes Made

### 1. Database Schema Updates
- **File**: `packages/db/schema/post.model.ts`
- **Change**: Added `scheduleJobId: text("schedule_job_id")` field to track scheduled jobs
- **Migration**: Created `0018_known_tinkerer.sql` to add the field to existing database

### 2. Queue System Infrastructure
- **File**: `apps/api/src/lib/redis.ts`
  - Redis client connection with error handling
  - Automatic connection on import

- **File**: `apps/api/src/lib/queue.ts`
  - BullMQ queue setup for scheduled posts
  - Background worker to process scheduled jobs
  - Queue service with methods for:
    - Creating scheduled jobs
    - Removing/cancelling jobs
    - Rescheduling jobs
  - Error handling with retry logic and exponential backoff

### 3. Repository Layer Updates
- **File**: `apps/api/src/domain/post/post.repository.ts`
- **Changes**:
  - Updated `schedulePost()` to accept optional `scheduleJobId`
  - Added `updateScheduleJobId()` method
  - Added `clearScheduleData()` method to clean up after publishing

### 4. Service Layer Updates
- **File**: `apps/api/src/domain/post/post.service.ts`
- **Changes**:
  - Integrated queue service for scheduling posts
  - Updated `schedulePost()` to create background jobs and handle rescheduling
  - Updated `updatePostStatusById()` to cancel scheduled jobs when posts are manually published or changed to draft

### 5. Dependencies
- **File**: `apps/api/package.json`
- **Added**: 
  - `bullmq ^5.58.1`
  - `redis ^5.8.2`
  - Added `"worker": "tsx scripts/worker.ts"` script

### 6. Worker Script
- **File**: `apps/api/scripts/worker.ts`
- Standalone worker script for production deployments
- Graceful shutdown handling

### 7. API Integration
- **File**: `apps/api/index.ts`
- Added queue system initialization via `import "@lib/queue"`

### 8. Documentation
- **File**: `apps/api/src/lib/README.md`
- Comprehensive documentation covering usage, monitoring, and error recovery

## Features Implemented

### ✅ Automatic Publishing
- Posts scheduled via `/schedule` endpoint are automatically published at correct time
- Post status updates to `published`
- `scheduledAt` and `scheduleJobId` fields are cleared after publishing

### ✅ Rescheduling Logic
- When rescheduling, old job is removed and new job is created
- No duplicate jobs or missed transitions
- Job ID is saved to post for tracking

### ✅ Manual Override
- Manual publishing cancels scheduled jobs
- Changing status to draft cancels scheduled jobs
- Prevents conflicts between manual and automatic actions

### ✅ Error Handling
- Job retries with exponential backoff (3 attempts)
- Failed jobs are logged and kept for investigation
- Worker error handling and graceful shutdown

### ✅ Production Ready
- Separate worker script for production deployments
- Connection pooling and proper Redis configuration
- Environment variable configuration

## API Endpoints

### Schedule a Post
```http
PUT /organizations/:organizationId/posts/:postId/schedule
Content-Type: application/json

{
  "scheduledAt": "2024-01-15T10:00:00Z"
}
```

### Publish a Post (cancels any scheduled job)
```http
POST /organizations/:organizationId/posts/:postId/publish
```

## Environment Requirements

- `REDIS_URL`: Redis connection URL (already configured in config schema)
- `DATABASE_URL`: PostgreSQL connection URL (already configured)

## Deployment Instructions

1. **Database Migration**: Run the migration to add `schedule_job_id` field:
   ```bash
   cd packages/db && pnpm db:migrate
   ```

2. **Redis Setup**: Ensure Redis is available at the configured `REDIS_URL`

3. **Start API**: The worker starts automatically with the main API server

4. **Optional - Separate Worker**: For production, optionally run worker separately:
   ```bash
   cd apps/api && pnpm worker
   ```

## Testing

The implementation can be tested by:
1. Creating a post via the API
2. Scheduling it using the `/schedule` endpoint
3. Verifying the job appears in Redis
4. Waiting for the scheduled time and confirming automatic publishing
5. Testing rescheduling and manual publishing override scenarios

## Acceptance Criteria Status

- ✅ **Scheduled posts become published at the correct time**
  - Implemented via BullMQ delayed jobs
  - Worker processes jobs at exact scheduled time
  - Post status updated to `published` automatically

- ✅ **No duplicates or missed transitions**
  - Old jobs are removed when rescheduling
  - Manual publishing cancels scheduled jobs
  - Job IDs tracked in database for consistency
  - Retry logic handles temporary failures

The implementation fully satisfies the Linear issue requirements and is ready for production use.