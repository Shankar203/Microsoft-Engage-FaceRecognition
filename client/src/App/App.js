import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../routes/Home";
import Loginf1 from "../routes/factor1UserRoutes/Loginf1";
import Signupf1 from "../routes/factor1UserRoutes/Signupf1";
import Loginf2 from "../routes/factor2UserRoutes/Loginf2";
import Loginf3 from "../routes/factor3UserRoutes/Loginf3";
import ProtectedRoute from "../routes/potectedRoutes/ProtectedRoute";
import "../styles/App.css";
import Signup from "../routes/userRoutes/Signup";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/signup1" element={<Signupf1 />} />
				<Route path="/login1" element={<Loginf1 />} />
				<Route path="/signup" element={<Signup />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/login2" element={<Loginf2 />} />
					<Route path="/login3" element={<Loginf3 />} />
					<Route path="" element={<Home />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
