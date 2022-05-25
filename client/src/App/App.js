import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../routes/Login";
import Signup from "../routes/Signup";
import "../styles/App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={
					<div>
						hello there, check....
					</div>
				} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
