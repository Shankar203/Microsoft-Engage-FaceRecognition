import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Loginf1 = () => {
	const navigate = useNavigate();
	const emailRef = useRef();
	const passwordRef = useRef();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			const res = await axios.post(
				"https://microsoft-engage-facerecognition.azurewebsites.net/api/user/login1",
				{
					email: emailRef.current.value,
					password: passwordRef.current.value,
				},
				{
					withCredentials: true,
				}
			);
			setSuccess(res.data.msg);
			setLoading(false);
			setTimeout(() => {
				alert(res.data.msg);
				navigate("/login2");
			}, 100);
		} catch (err) {
			e.target.reset();
			console.error(err);
			setError(err.response ? err.response.data.msg : err.msg);
			setLoading(false);
		}
	};

	return (
		<div>
			<Navbar />
			<div style={{ maxWidth: "400px" }} className="mt-4 card mx-auto">
				<form className="mx-4 card-body" onSubmit={handleSubmit}>
					<h3 className="text-start card-title pt-4 pb-3">Login (factor-1)</h3>
					{error && (
						<div className="p-2 alert alert-danger" role="alert">
							<i className="bi bi-exclamation-triangle-fill mx-1"></i>
							{error}
						</div>
					)}
					{success && (
						<div className="p-2 alert alert-success" role="alert">
							<i className="bi bi-check-circle-fill mx-1"></i>
							{success}
						</div>
					)}
					<input
						type="email"
						className={"form-control my-3" + (error && " is-invalid")}
						placeholder="email"
						name="email"
						required
						ref={emailRef}
						disabled={loading}
					/>
					<input
						type="password"
						className={"form-control my-2" + (error && " is-invalid")}
						minLength={6}
						placeholder="password"
						name="password"
						required
						ref={passwordRef}
						disabled={loading}
					/>
					<div className="d-grid mt-3">
						<button type="submit" disabled={loading || success} className="btn btn-primary">
							{loading && (
								<span
									className="spinner-grow spinner-grow-sm mx-1"
									role="status"
									aria-hidden="true"
								></span>
							)}
							Login
						</button>
					</div>
					<div className="mt-3 text-center text-muted">
						<span>
							Don't have an account?
							<Link to="/signup1" className="link-primary text-decoration-none">
								{" "}
								Signup
							</Link>
						</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Loginf1;
