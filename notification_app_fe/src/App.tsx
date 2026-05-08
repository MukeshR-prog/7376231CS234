import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import NotificationsPage
  from "./pages/NotificationsPage";

import PriorityPage
  from "./pages/PriorityPage";

const App = () => {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<NotificationsPage />}
        />

        <Route
          path="/priority"
          element={<PriorityPage />}
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;