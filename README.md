# YelpCamp 🏕️

A full-stack campground sharing application where users can discover places to camp, share their own campgrounds, and leave reviews.

**Live website:** https://yelpcamp-amber.vercel.app/

## Features

- Register, log in, and log out.
- Create, view, edit, and delete campgrounds.
- Upload campground images through Cloudinary.
- Explore campgrounds on an interactive cluster map.
- View each campground’s location on a map.
- Leave star ratings and written reviews.
- Restrict editing and deletion to the respective campground or review author.
- Display consistent image sizes across listings and detail pages.

## Tech Stack

| Component | Technology |
|---|---|
| Backend | Node.js, Express |
| Templates and styling | EJS, Bootstrap, CSS |
| Database | MongoDB Atlas, Mongoose |
| Authentication | Passport.js, passport-local |
| Sessions | express-session, connect-mongo |
| Image uploads | Multer, Cloudinary |
| Maps | MapTiler SDK |
| Validation and security | Joi, Helmet, express-mongo-sanitize |
| Deployment | Vercel |

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Noobynoodles/yelpcamp.git
cd yelpcamp
```

### 2. Install dependencies

Install Node.js and npm, then run:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DB_URL=your_mongodb_connection_string
SECRET=your_session_secret
MAPTILER_API_KEY=your_maptiler_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

You will need:

- A MongoDB Atlas database and database user.
- A MapTiler API key.
- A Cloudinary account with an API key and matching API secret.

Include the database name in your MongoDB connection string, and configure Atlas network access to allow your application to connect.

Keep `.env` private and excluded from Git.

### 4. Start the application

```bash
node app.js
```

Open http://localhost:3000 in your browser.

## Seed Sample Campgrounds

The project includes a seed script for generating sample campground listings.

Before running it:

1. Ensure the script loads the root `.env` file and connects to the intended database.
2. Register an account and replace the seed script’s `author` value with that user’s MongoDB `_id`.
3. Check that the image URLs in the script are valid.
4. Review the number of campgrounds the script generates.

```bash
node seeds/index.js
```

**Warning:** If the script contains `Campground.deleteMany({})`, it deletes all existing campgrounds in the connected database before inserting sample data.

## Project Structure

```text
YelpCamp/
├── cloudinary/       # Cloudinary configuration and upload storage
├── controllers/      # Request handling
├── models/           # Mongoose models
├── public/           # Browser JavaScript and stylesheets
├── routes/           # Express routes
├── seeds/            # Sample campground data and seed script
├── utils/            # Error handling utilities
├── views/            # EJS templates and shared layouts
├── app.js            # Application setup
├── expressMiddleware.js
├── schema.js         # Request validation schemas
├── package.json
└── vercel.json       # Vercel configuration
```

## Deploy to Vercel

Add the environment variables listed above to your Vercel project and enable them for Production.

Deploy from the project root:

```bash
vercel --prod
```

Redeploy after changing Vercel environment variables so the application uses the updated values.

MongoDB Atlas stores application data, while Cloudinary stores uploaded images. These are managed separately from the GitHub repository.
