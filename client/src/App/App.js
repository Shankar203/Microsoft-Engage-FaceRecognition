import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../routes/Home";
import Login from "../routes/userRoutes/Login";
import Signup from "../routes/userRoutes/Signup";
import ProtectedRoute from "../routes/potectedRoutes/ProtectedRoute";
import "../styles/App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route path="" element={<Home />} />
				</Route>
				<Route path="/" element={<Home />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
