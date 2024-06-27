import React from "react";

const Modal = ({ isVisible, onClose, booking }) => {
  if (!isVisible) return null;

  const bookingType = booking.bookedItem.item.hotelName
    ? "Hotel"
    : booking.bookedItem.item.vehicleModel
    ? "Vehicle"
    : "Tour";

  const {
    hotelName,
    vehicleModel,
    title,
    images,
    description,
    price,
    rating,
    noOfReviews,
    amenities,
    features,
    additionalServices,
    location,
    duration,
    personsAllowed,
    availableDates,
  } = booking.bookedItem.item;

  const { fullName, cnic, gender } = booking.bookedUserInfo;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-2xl mx-auto relative overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-semibold">
            {hotelName || vehicleModel || title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <p className="text-lg text-blue-600 font-bold mb-4">
            Price: Rs {booking.bookedItem.price}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <img
                src={images[0]}
                alt={hotelName || vehicleModel || title}
                className="w-full h-64 object-cover rounded"
              />
            </div>
            <div>
              <p className="mb-2">
                <span className="font-bold">Type:</span> {bookingType}
              </p>
              <p className="mb-2">
                <span className="font-bold">Description:</span> {description}
              </p>
              <p className="mb-2">
                <span className="font-bold">Rating:</span> {rating} (
                {noOfReviews} reviews)
              </p>
              <p className="mb-2">
                <span className="font-bold">Location:</span> {location}
              </p>
              {bookingType === "Tour" && (
                <>
                  <p className="mb-2">
                    <span className="font-bold">Duration:</span> {duration} days
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">Persons Allowed:</span>{" "}
                    {personsAllowed}
                  </p>
                </>
              )}
              {bookingType === "Vehicle" && (
                <div className="mb-2">
                  <span className="font-bold">Features:</span>
                  <ul className="list-disc list-inside">
                    {features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(amenities || additionalServices) && (
                <div className="mb-2">
                  <span className="font-bold">Amenities:</span>
                  <ul className="list-disc list-inside">
                    {(amenities || additionalServices).map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Booked By</h3>
            <p className="mb-2">
              <span className="font-bold">Name:</span> {fullName}
            </p>
            <p className="mb-2">
              <span className="font-bold">CNIC:</span> {cnic}
            </p>
            <p className="mb-2">
              <span className="font-bold">Gender:</span> {gender}
            </p>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
