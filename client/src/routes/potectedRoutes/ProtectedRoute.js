import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
	const location = useLocation();
	const [user, setUser] = useState();
	const [redirectPath, setRedirectPath] = useState();

	useEffect(() => {
		axios
			.get("http://localhost:3080/api/user/authorize/", {
				withCredentials: true,
			})
			.then((res) => {
				if (location.pathname === "/login3" && res.data.fac === 1) {
					setRedirectPath("/login1");
				} else {
					setUser(res.data.user);
				}
			})
			.catch((err) => setRedirectPath("/login1"));
	}, []);

	if (user) return <Outlet context={{ user }} />;
	if (redirectPath) return <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
