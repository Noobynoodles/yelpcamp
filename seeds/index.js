require('dotenv').config({
    path: require('path').join(__dirname, '../.env')
});

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
// mongoose.connect(dbUrl);

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
    throw new Error('DB_URL is missing from your .env file');
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //Your user id here
            author: '6ad90d3b3ce9fd0b2390006b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.Alias omnis debitis nulla eum, autem, incidunt voluptas explicabo esse consequatur blanditiis obcaecati suscipit ipsum vero accusamus, doloremque vitae corporis provident assumenda!',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/sajamp2v/image/upload/v1792088669/YelpCamp/zvqq3a6iendyx8fk7ogu.jpg',
                    filename: 'YelpCamp/zvqq3a6iendyx8fk7ogu',
                },
            ]
        })
        await camp.save();
    }
}

// seedDB().then(() => {
//     mongoose.connection.close();
// })

async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to database:', mongoose.connection.name);

        await seedDB();
        console.log('Successfully seeded 50 campgrounds');
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

main();