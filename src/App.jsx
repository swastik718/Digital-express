// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import ConfirmationPage from "./pages/Confirmation.jsx";
import ErrorComponent from "./Components/Error.jsx";
import FileUpload from "./pages/fileUpload.jsx"
import LoginPage from "./pages/LoginPage.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import Store from "./Components/Store.jsx";
function App() {
  return (
    <Router>
      <Routes>
        {/* App layout */}
        <Route element={<Store />}>
          <Route path="/" element={<Store />} />
          
        </Route>
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route
              path="/fileupload"
              element={
                <PrivateRoute>
                  <FileUpload />
                </PrivateRoute>
              }
            />
            <Route path="/admin" element={<LoginPage />} />
        {/* 404 */}
        <Route path="*" element={<ErrorComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
