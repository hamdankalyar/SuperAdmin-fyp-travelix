import React, { useState } from "react";

const SendEmail = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !subject || !message) {
      setResponseMessage("All fields are required.");
      setIsModalVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setResponseMessage("Please enter a valid email address.");
      setIsModalVisible(true);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, subject, message }),
        }
      );
      const data = await response.json();
      setResponseMessage(data.message || "Email sent successfully.");
    } catch (error) {
      setResponseMessage("Error sending email. Please try again.");
    } finally {
      setIsModalVisible(true);
      setEmail("");
      setSubject("");
      setMessage("");
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Send Email
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 p-2 block w-full border rounded-md ${
                !email && "border-red-500"
              }`}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`mt-1 p-2 block w-full border rounded-md ${
                !subject && "border-red-500"
              }`}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`mt-1 p-2 block w-full border rounded-md ${
                !message && "border-red-500"
              }`}
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700"
          >
            Send Email
          </button>
        </form>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Response
            </h2>
            <p className="text-gray-700">{responseMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendEmail;
