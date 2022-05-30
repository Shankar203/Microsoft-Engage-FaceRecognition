import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Loginf2 = () => {
	const navigate = useNavigate();
	const tOTPRef = useRef();
	const [tOTPauthURL, setTOTPauthURL] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios
			.get("https://microsoft-engage-facerecognition.azurewebsites.net/api/user/login2", { withCredentials: true })
			.then((res) => setTOTPauthURL(res.data.tOTPauthURL))
			.catch(console.error);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			const res = await axios.post(
				"https://microsoft-engage-facerecognition.azurewebsites.net/api/user/login2",
				{
					tOTP: tOTPRef.current.value,
				},
				{
					withCredentials: true,
				}
			);
			setSuccess(res.data.msg);
			setLoading(false);
			setTimeout(() => {
				alert(res.data.msg);
				navigate("/login3");
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
				<form className="mx-4 text-center card-body" onSubmit={handleSubmit}>
					<h3 className="text-start card-title pt-4 pb-3">Login (factor-2)</h3>
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
						type="text"
						className={"form-control my-3" + (error && " is-invalid")}
						inputMode="numeric"
						autoComplete="one-time-code"
						pattern="\d{6}"
						name="tOTP"
						placeholder="tOTP"
						required
						ref={tOTPRef}
						disabled={loading}
					/>
					{tOTPauthURL && <img src={tOTPauthURL} alt="tOTP QR-Code" />}
					<div className="d-grid mt-3">
						<button type="submit" disabled={loading || success} className="btn btn-primary">
							{loading && (
								<span
									className="spinner-grow spinner-grow-sm mx-1"
									role="status"
									aria-hidden="true"
								></span>
							)}
							Authenticate
						</button>
					</div>
					<div className="mt-3 text-center text-muted">
						<span>
							Login with a different account?
							<Link to="/login1" className="link-primary text-decoration-none">
								{" "}
								Login
							</Link>
						</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Loginf2;
