const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Booking, ValidateBooking } = require("../models/booking");
const Stripe = require("stripe");
const { Tour } = require("../models/tourPackage");
const { HotelBooking } = require("../models/hotelbooking");
const { VehicleBooking } = require("../models/vehiclebooking");

const stripe = new Stripe(
  "sk_test_51P6FSHJ8YlrI7gTXmcjhjVeM4TnzNhU4oSr3eVOznhniTznh9rfeE8Aqx9sgbpStT28sxw8UAJyHG6yJJq0YTJ6Y00ovQ09B5Q"
);
// Path   : /api/bookings
// Method : GET
// Access : Private
// Desc   :Get all bookings list (For Admin)
router.get("/", async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id });
  res.status(200).send(bookings);
});
router.get("/delivered-bookings", async (req, res) => {
  try {
    // Fetch all delivered bookings for each type
    const hotelBookings = await HotelBooking.find({
      isDelivered: true,
    }).populate("bookedItem.item");
    const vehicleBookings = await VehicleBooking.find({
      isDelivered: true,
    }).populate("bookedItem.item");
    const tourBookings = await Booking.find({ isDelivered: true }).populate(
      "bookedItem.item"
    );

    // Combine all bookings into a single array
    const allDeliveredBookings = [
      ...hotelBookings,
      ...vehicleBookings,
      ...tourBookings,
    ];

    res.status(200).json(allDeliveredBookings);
  } catch (error) {
    console.error("Error fetching delivered bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/mobile", async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const booking = new Booking(req.body);

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.bookedItem.price,
      currency: "usd",
      payment_method: paymentMethod.id,
      automatic_payment_methods: { enabled: true },
    });

    // Save the booking into the database
    booking.isStatus = true;
    await booking.save();

    // Send the clientSecret back to the client
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error while creating payment intent:", error);
    res.status(500).send({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid user Id!");
  }
  const booking = await Booking.findById(id).populate("bookedItem.item");
  if (!booking) {
    return res.status(404).send("Booking not found");
  }
  res.status(200).send(booking);
});

// Path   : /api/bookings/id
// Method : GET
// Access : Private
// Desc   :Get a bookings(For Admin & User)
router.post("/", async (req, res) => {
  try {
    const { user, bookedItem, bookedUserInfo, travellersInfo, paymentType } =
      req.body;
    const { paymentMethod } = req.body;
    //use my key
    // const stripe = new Stripe(
    //   "sk_test_51MpYaDSGTswR1vciQcDNb47pImQECcrTwmD7kFGaiGSUV67WNHfz7poKR7OEJCV0XuNCJoCwSDSiuAWGJMoGazeV00yHqaX7VU"
    // );
    const booking = new Booking({
      user,
      bookedItem,
      bookedUserInfo,
      travellersInfo,
      paymentType,
    });
    await stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      currency: "USD",
      amount: booking.bookedItem.price,
      confirm: true,
      description: `${booking.user.name} booked this Tour`,
      return_url: "http://localhost:5173/", // Replace this with your actual return URL
    });
    booking.isStatus = true;
    booking.bookingAt = new Date();
    await removeBookedSeats(
      booking.bookedItem.item,
      booking.bookedItem.numberOfPersons
    );
    await booking.save();
    res.status(200).send(booking);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Update payment

router.put("/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).send("Invalid ID!");
    }

    const booking = await Booking.findById(paymentId).populate("user", "name");

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    res.status(200).send(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).send("Internal Server Error");
  }
});
//Delete the Payment
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Id!");
  }
  const booking = await Booking.findByIdAndDelete(id);
  if (!booking) {
    return res.status(404).send("Booking not found");
  }
  res.status(200).send(booking);
});

const removeBookedSeats = async (id, qty) => {
  try {
    console.log("Removing booked seats for tour:", id, "Quantity:", qty);
    const tour = await Tour.findById(id);

    if (!tour) {
      console.log("Tour not found with ID:", id);
      return; // Exit early if tour is not found
    }

    console.log(
      "Existing number of persons allowed before update:",
      tour.personsAllowed
    );

    // Subtract the booked quantity from the total persons allowed
    tour.personsAllowed -= qty;

    // Save the updated tour document
    await tour.save();

    console.log(
      "Successfully removed",
      qty,
      "seats. Updated number of persons allowed:",
      tour.personsAllowed
    );
  } catch (error) {
    console.error("Error removing booked seats:", error.message);
  }
};

async function updateBookings() {
  try {
    // Update HotelBookings
    await HotelBooking.updateMany({}, { $set: { isDelivered: false } });
    console.log("HotelBookings updated successfully");

    // Update VehicleBookings
    await VehicleBooking.updateMany({}, { $set: { isDelivered: false } });
    console.log("VehicleBookings updated successfully");

    // Update Bookings
    await Booking.updateMany({}, { $set: { isDelivered: false } });
    console.log("Bookings updated successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating bookings:", error);
    mongoose.connection.close();
  }
}

router.post("/pay/:id", async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    let booking;

    switch (type) {
      case "hotel":
        booking = await HotelBooking.findById(id);
        break;
      case "vehicle":
        booking = await VehicleBooking.findById(id);
        break;
      case "tour":
        booking = await Booking.findById(id);
        break;
      default:
        return res.status(400).json({ error: "Invalid booking type" });
    }

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.isDelivered = true;
    await booking.save();

    res.status(200).json({ message: "Booking marked as delivered" });
  } catch (error) {
    console.error("Error marking booking as delivered:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/superAdmin/bookings", async (req, res) => {
  try {
    // Fetch hotel bookings where isDelivered is false
    const hotelBookings = await HotelBooking.find({
      isDelivered: false,
    }).populate({
      path: "bookedItem.item",
      populate: {
        path: "hotelOwner",
        select: "-password",
      },
    });

    // Fetch vehicle bookings where isDelivered is false
    const vehicleBookings = await VehicleBooking.find({
      isDelivered: false,
    }).populate({
      path: "bookedItem.item",
      populate: {
        path: "vehicleOwner",
        select: "-password",
      },
    });

    // Fetch tour bookings where isDelivered is false
    const tourBookings = await Booking.find({ isDelivered: false }).populate({
      path: "bookedItem.item",
      populate: {
        path: "tourOwner",
        select: "-password",
      },
    });

    // Combine results into a single array
    const allBookings = [...hotelBookings, ...vehicleBookings, ...tourBookings];
    res.status(200).send(allBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/superAdmin/bookings/count", async (req, res) => {
  try {
    // Count hotel bookings where isDelivered is false
    const hotelBookingsCount = await HotelBooking.countDocuments({
      isDelivered: false,
    });

    // Count vehicle bookings where isDelivered is false
    const vehicleBookingsCount = await VehicleBooking.countDocuments({
      isDelivered: false,
    });

    // Count tour bookings where isDelivered is false
    const tourBookingsCount = await Booking.countDocuments({
      isDelivered: false,
    });

    // Calculate the total number of bookings
    const totalBookingsCount =
      hotelBookingsCount + vehicleBookingsCount + tourBookingsCount;

    // Send the total count as the response
    res.status(200).json({ totalBookingsCount });
  } catch (error) {
    console.error("Error fetching booking count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Path   : /api/bookings/user/:userId
// Method : GET
// Access : Private
// Desc   :Get a bookings(For Admin & User)
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch bookings from different collections/documents
    const hotelBookings = await HotelBooking.find({ user: userId })
      .populate("user", "-password")
      .populate("bookedItem.item"); // Populate the bookedItem.item field

    const vehicleBookings = await VehicleBooking.find({ user: userId })
      .populate("user", "-password")
      .populate("bookedItem.item"); // Populate the bookedItem.item field

    const tourBookings = await Booking.find({ user: userId })
      .populate("user", "-password")
      .populate("bookedItem.item"); // Populate the bookedItem.item field

    // Combine results into a single array
    const allBookings = [...hotelBookings, ...vehicleBookings, ...tourBookings];

    res.status(200).send(allBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/owner/:ownerId", async (req, res) => {
  const { ownerId } = req.params;
  try {
    // Fetch bookings and populate the necessary fields
    const bookings = await Booking.find({});

    // Populate bookedItem.item with tourOwner information
    await Booking.populate(bookings, {
      path: "bookedItem.item",
      populate: {
        path: "tourOwner",
        model: "User",
        select: "name email", // Selecting only name and email fields
      },
    });

    // Filter bookings based on ownerId
    const filteredBookings = bookings.filter((booking) => {
      const owner = booking.bookedItem.item?.tourOwner?._id;
      return owner && owner.toString() === ownerId;
    });

    res.send(filteredBookings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error.message);
  }
});

router.put("/updateFeedback/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the booking by product ID and update feedbackGiven to true
    const booking = await Booking.findOneAndUpdate(
      { "bookedItem.item": productId }, // Assuming the product ID is stored in the bookedItem.item field
      { feedbackGiven: true },
      { new: true }
    );

    if (!booking) {
      return res.status(404).send(false);
    }
    // Return the updated booking
    return res.status(200).send(true);
  } catch (error) {
    console.error(error);
    return res.status(500).send(false);
  }
});
module.exports = router;
