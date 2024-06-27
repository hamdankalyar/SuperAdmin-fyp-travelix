import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

const Index = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("hotel"); // Default filter state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [paymentBookingId, setPaymentBookingId] = useState(null);
  const [paymentBookingType, setPaymentBookingType] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/bookings/superAdmin/bookings"
      );
      setBookings(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setIsLoading(false);
    }
  };

  const filterBookings = (type) => {
    setFilter(type);
  };

  const getBookingType = (booking) => {
    if (booking.bookedItem.item.hotelName) return "hotel";
    if (booking.bookedItem.item.vehicleModel) return "vehicle";
    if (booking.bookedItem.item.title) return "tour";
    return "unknown";
  };

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  const handleMoneyPaid = async (bookingId, bookingType) => {
    console.log(bookingId, bookingType);

    setPaymentBookingId(bookingId);
    setPaymentBookingType(bookingType);
    setConfirmPayment(true);
  };

  const confirmPaymentAction = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/bookings/pay/${paymentBookingId}`,
        { type: paymentBookingType }
      );
      console.log("Payment success:", response.data);

      // After payment success, re-fetch bookings to refresh screen
      fetchBookings();

      // Reset confirmation state
      setConfirmPayment(false);
      setPaymentBookingId(null);
      setPaymentBookingType(null);
    } catch (error) {
      console.error("Error making payment:", error);
      // Handle error scenario
    }
  };

  const cancelPaymentAction = () => {
    setConfirmPayment(false);
    setPaymentBookingId(null);
    setPaymentBookingType(null);
  };

  const filteredBookings = bookings.filter(
    (booking) => filter === "all" || getBookingType(booking) === filter
  );

  return (
    <div className="p-6">
      <nav className="mb-6 flex space-x-4">
        <button
          onClick={() => filterBookings("hotel")}
          className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 ${
            filter === "hotel" ? "bg-blue-700" : ""
          }`}
        >
          Hotels
        </button>
        <button
          onClick={() => filterBookings("vehicle")}
          className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 ${
            filter === "vehicle" ? "bg-green-700" : ""
          }`}
        >
          Vehicles
        </button>
        <button
          onClick={() => filterBookings("tour")}
          className={`bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700 ${
            filter === "tour" ? "bg-yellow-700" : ""
          }`}
        >
          Tours
        </button>
      </nav>
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>

      {isLoading ? (
        <p className="text-lg">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-lg">No bookings yet.</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-lg">No {filter} bookings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-md rounded p-4 flex flex-col"
            >
              <h2 className="text-xl font-semibold mb-2">
                {booking.bookedItem.item.hotelName ||
                  booking.bookedItem.item.vehicleModel ||
                  booking.bookedItem.item.title}
              </h2>
              <p className="text-lg text-blue-600 font-bold mb-2">
                Price: Rs {booking.bookedItem.price}
              </p>
              <p className="mb-2">
                Owner:{" "}
                {booking.bookedItem.item.hotelOwner?.name ||
                  booking.bookedItem.item.vehicleOwner?.name ||
                  booking.bookedItem.item.tourOwner?.name}
              </p>
              <p className="text-gray-600 mb-4">
                Booking Date:{" "}
                {new Date(
                  booking.bookedItem.bookingDate?.startDate ||
                    booking.bookedItem.tourDate?.startDate
                ).toLocaleDateString()}
              </p>
              <button
                onClick={() => showBookingDetails(booking)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mb-2"
              >
                View Details
              </button>
              <button
                onClick={() =>
                  handleMoneyPaid(booking._id, getBookingType(booking))
                }
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
              >
                Money Paid
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isVisible={isModalVisible}
        onClose={closeModal}
        booking={selectedBooking}
      />

      {confirmPayment && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-lg mb-4">
              Are you sure you want to mark payment as delivered?
            </p>
            <div>
              <button
                onClick={confirmPaymentAction}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 mr-2"
              >
                Yes
              </button>
              <button
                onClick={cancelPaymentAction}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
