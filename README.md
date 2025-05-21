# Takehome App

A full-stack e-commerce application built with Next.js, Express, PostgreSQL, and AWS.

## Development Approach

I approached this project by breaking it down into smaller, manageable features:

1. **Authentication & User Management**

   - Implemented Clerk for secure authentication
   - Set up protected routes and user sessions

2. **Product Management**

   - Created CRUD operations for products
   - Implemented image upload with AWS S3 and Cloudfront (CDN)
   - Added product filtering and search

3. **Database & API**

   - Set up PostgreSQL with Drizzle ORM
   - Designed RESTful API endpoints
   - Implemented data validation and error handling

4. **UI/UX**
   - Built responsive product listings
   - Created intuitive product filters
   - Implemented smooth image galleries

This modular approach made the development process more organized and easier to maintain.

## Server Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
bun install
```

3. Set up PostgreSQL:

   - Download and install [PgAdmin](https://www.pgadmin.org/download/)
   - Create a new database for the project
   - Note down your database connection details

4. Configure environment variables:
   Create a `.env` file in the server directory with the following variables:

   ```env
   # Server
   PORT=3001

   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

   # AWS
   AWS_BUCKET_NAME="your-bucket-name"
   AWS_BUCKET_REGION="your-region"
   AWS_ACCESS_KEY="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_CLOUD_FRONT_STREAM_URL="your-cloudfront-url"
   ```

5. Set up AWS S3 and CloudFront:

   - [Create an S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)
   - [Set up CloudFront distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html)
   - Configure CORS for your S3 bucket
   - Note down your AWS credentials and CloudFront URL

6. Initialize the database:

```bash
bun run db:generate
bun run db:migrate
```

7. Start the server:

```bash
bun run dev
```

## Client Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
bun install
```

3. Set up Clerk Authentication:

   - [Create a Clerk account](https://clerk.com/docs/quickstarts/get-started)
   - Create a new application in Clerk
   - Configure your authentication settings
   - Note down your Clerk API keys

4. Configure environment variables:
   Create a `.env` file in the client directory with the following variables:

   ```env
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-publishable-key"
   CLERK_SECRET_KEY="your-secret-key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/auth/callback"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/auth/callback"

   # API
   NEXT_PUBLIC_BASE_API_URL="http://localhost:3001/api"
   ```

5. Start the client:

```bash
bun run dev
```

## Additional Resources

- [PgAdmin Documentation](https://www.pgadmin.org/docs/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [Clerk Documentation](https://clerk.com/docs)
