import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const [user, setUser] = useState();
	const [redirectPath, setRedirectPath] = useState();

	useEffect(() => {
		axios
			.get("http://localhost:3080/api/user/authorize/", { withCredentials: true })
			.then((res) => setUser(res.data.user))
			.catch((err) => setRedirectPath("/login"));
	}, []);

	if (user) return <Outlet context={{ user }} />;
	if (redirectPath) return <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
