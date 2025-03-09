import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../page/Home";
import NotFound from "../page/NotFound";
import LoginPage from "../page/LoginPage";
import CartPage from "../page/CartPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
