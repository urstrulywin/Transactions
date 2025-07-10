import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Dashboard } from "./pages/Dashboard";
import { Transfer } from "./pages/Transfer";
import { LandingPage } from "./pages/LandingPage";
import { Layout } from "./components/Layout";
function App() {
  return (
    <>
       <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/send" element={<Transfer />} />
            </Route>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
