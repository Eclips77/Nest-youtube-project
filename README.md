# Video Platform API

A modular, Clean Architecture-based REST API built with NestJS.

## Features

*   **Dynamic Data Persistence:** Switch between MongoDB and JSON Filesystem storage using `.env`.
*   **Storage Abstraction:** Switch between Local Filesystem and AWS S3 for file storage.
*   **Video Encoding:** Automatic video encoding triggers upon upload using FFmpeg.
*   **Advanced Validation:** Custom pipes to validate relationships (e.g., verifying Genre exists when creating a Video).
*   **Elasticsearch Logging:** Centralized logging of all requests and exceptions to Elasticsearch.
*   **Clean Architecture:** Strict separation of concerns using Repository Pattern, Factory Pattern, and Strategy Pattern.

## Prerequisites

*   Node.js (v18+)
*   MongoDB (if using Mongo mode)
*   Elasticsearch (Required for logging)
*   FFmpeg (Required for encoding)

## Installation

```bash
npm install
```

## Configuration (.env)

Create a `.env` file in the root directory.

### Common Settings

```env
NODE_ENV=development
PORT=3000
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_INDEX=video-platform-logs
```

### Database Mode

**Option 1: JSON (Local Files)**
```env
DB_TYPE=JSON
JSON_DB_PATH=./data
```

**Option 2: MongoDB**
```env
DB_TYPE=MONGO
MONGO_URI=mongodb://localhost:27017/video-platform
```

### Storage Mode

**Option 1: Local Filesystem**
```env
STORAGE_TYPE=FS
```

**Option 2: AWS S3**
```env
STORAGE_TYPE=S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=your_bucket
AWS_REGION=us-east-1
```

## Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Overview

### Genres
*   `GET /genres` - List all genres
*   `POST /genres` - Create a new genre
    *   Body: `{ "name": "Action", "description": "Action movies" }`

### Videos
*   `GET /videos` - List all videos
*   `POST /videos` - Upload a video
    *   Form-Data:
        *   `file`: (Video File)
        *   `title`: "My Video"
        *   `genreId`: "UUID_OR_MONGO_ID"

### Playlists
*   `GET /playlists` - List all playlists
*   `POST /playlists` - Create a playlist
    *   Body: `{ "name": "Favorites", "videoIds": ["ID1", "ID2"] }`

## Architecture Highlights

### Directory Structure
*   `src/core`: Core infrastructure (Logger, Storage).
*   `src/common`: Shared utilities, filters, constants.
*   `src/modules`: Feature modules (Genres, Videos, Playlists, Encoding).

### Patterns Used
*   **Repository Pattern:** `IGenreRepository`, `IVideoRepository` etc. decouple business logic from data access.
*   **Factory Pattern:** Used in modules to inject the correct Repository implementation (Mongo vs JSON) based on config.
*   **Strategy Pattern:** Used in `StorageModule` to switch between FS and S3 storage strategies.
