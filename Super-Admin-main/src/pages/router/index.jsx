import { Route, Routes } from "react-router-dom";
import Dashboard from "../dashboard";
import Verifications from "../Verifications";
import PaymentTransfer from "../PaymentTransfer";
import Users from "../UsersManagement";
import SendEmail from "../emailpage";
import DeliveredBookings from "../Payment History/Index";
export default function Router() {
  return (
    <Routes>
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route path="/verification" element={<Verifications />} />
      <Route path="/payments" element={<PaymentTransfer />} />
      <Route path="/history" element={<DeliveredBookings />} />
      <Route path="/users" element={<Users />} />
      <Route path="/email" element={<SendEmail />} />
    </Routes>
  );
}
