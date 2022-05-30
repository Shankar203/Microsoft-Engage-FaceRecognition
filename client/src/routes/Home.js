import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
	const user = useOutletContext();
	console.log(user.user);
	return (
		<div>
			<Navbar />
			<div style={{ maxWidth: "500px" }} className="mt-4 p-4 fs-5 lh-1 font-monospace rounded-3 card mx-auto">
				<p className="card-text">
					<b>User:</b> {user.user.email.split("@")[0]}
				</p>
				<p className="card-text">
					<b>Email:</b> {user.user.email}
				</p>
				<p className="card-text">
					<b>PrevLoign:</b> {user.user.createdAt}
				</p>
			</div>
		</div>
	);
};

export default Home;
