import React, { useState, useEffect } from "react";
import axios from "axios";

const DeliveredBookings = () => {
  const [deliveredBookings, setDeliveredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeliveredBookings();
  }, []);

  const fetchDeliveredBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/bookings/delivered-bookings"
      );
      setDeliveredBookings(response.data);
      console.log(response.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching delivered bookings:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Delivered Bookings</h1>
      {isLoading ? (
        <p className="text-lg">Loading...</p>
      ) : deliveredBookings.length === 0 ? (
        <p className="text-lg">No delivered bookings yet.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Booking Type</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {deliveredBookings.map((booking) => (
              <tr key={booking._id}>
                <td className="py-2 px-4 border-b">
                  {getBookingType(booking)}
                </td>
                <td className="py-2 px-4 border-b">
                  {booking.bookedItem.item.hotelName ||
                    booking.bookedItem.item.vehicleModel ||
                    booking.bookedItem.item.title}
                </td>
                <td className="py-2 px-4 border-b">
                  Rs {booking.bookedItem.price}
                </td>

                <td className="py-2 px-4 border-b">
                  {new Date(
                    booking.bookedItem.bookingDate?.startDate ||
                      booking.bookedItem.tourDate?.startDate
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const getBookingType = (booking) => {
  if (booking.bookedItem.item.hotelName) return "Hotel";
  if (booking.bookedItem.item.vehicleModel) return "Vehicle";
  if (booking.bookedItem.item.title) return "Tour";
  return "Unknown";
};

export default DeliveredBookings;
