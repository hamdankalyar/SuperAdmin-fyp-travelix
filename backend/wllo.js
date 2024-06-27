const { Tour } = require("./models/tourPackage");
const { TravelClub } = require("./models/travelClub");
const { Feedback } = require("./models/feedback");
const { User } = require("./models/user");
const { Car } = require("./models/carSchema");
const { Hotel } = require("./models/hotel");
const connectDb = require("./config/db");
const usersData = require("./data/users");
const packagesData = require("./data/packages");
const travelClubsData = require("./data/travelClubs");
const FeedbacksData = require("./data/feedbacks");
const carData = require("./data/cars");
const hotelData = require("./data/hotels");
const color = require("colors");
const dotenv = require("dotenv");
const { FeedbacksData } = require("./data/feedbacks");

dotenv.config();
connectDb();

const importData = async () => {
  try {
    await User.deleteMany({});
    await TravelClub.deleteMany({});
    await Tour.deleteMany({});
    await Feedback.deleteMany({});
    await Car.deleteMany({});
    await Hotel.deleteMany({});

    const users = await User.insertMany(usersData);
    const [, , , , user] = users;
    const [, , , clubOwner] = users;
    const [, carOwner] = users;
    const [, , hotelOwner] = users;

    const feedbacks = FeedbacksData.map((feedback) => {
      return {
        ...feedback,
        user: user._id,
      };
    });
    await Feedback.insertMany(feedbacks);

    const newTravelClub = travelClubsData.map((travelClub) => {
      return {
        ...travelClub,
        owner: {
          ...travelClub.owner,
          ownerId: clubOwner._id,
        },
      };
    });

    const club = await TravelClub.insertMany(newTravelClub);
    const newCars = carData.map((car) => {
      return {
        ...car,
        carOwner: carOwner._id,
      };
    });

    await Car.insertMany(newCars);

    const newHotels = hotelData.map((hotel) => {
      return {
        ...hotel,
        hotelOwner: hotelOwner._id,
      };
    });

    await Hotel.insertMany(newHotels);

    const newTours = packagesData.map((package) => {
      return {
        ...package,
        travelClub: club[0]._id,
      };
    });

    await Tour.insertMany(newTours);
    console.log("Imported Data Successfully!".bgYellow);
    process.exit();
  } catch (error) {
    console.log(`Unable to Seed Data!${error.message}`.bgRed);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany({});
    await TravelClub.deleteMany({});
    await Tour.deleteMany({});
    await Feedback.deleteMany({});
    await Car.deleteMany({});
    await Hotel.deleteMany({});
    console.log("Destroyed Data Successfully!".bgYellow);
    process.exit();
  } catch (error) {
    console.log(`Unable to destroy Data!${error.message}`.bgRed);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
