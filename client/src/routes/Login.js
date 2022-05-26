import { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CamPreview from "../components/CamPreview";
import {imageCapturer} from "../components/imageCapturer"

const Signup = () => {
	const emailRef = useRef()
	const videoParentRef = useRef();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData()
		const email = emailRef.current.value
		const imgFile = await imageCapturer({videoParentRef})
		formData.append("email", email)
		formData.append("pic", imgFile)
		console.log(formData);
		const res = await fetch("https://microsoft-engage-facerecognition.azurewebsites.net/api/user/login/", {
			method: "POST",
			body: formData
		})
		// const res = await axios({
		// 	method: 'POST',
		// 	url: "https://microsoft-engage-facerecognition.azurewebsites.net/api/user/login/",
		// 	data: formData,
		// 	// headers: {
		// 	// 	'Content-Type': 'application/json'
		// 	// },
		// 	// withCredentials: true
		// })
		console.log(res);
	};

	return (
		<div>
			<Navbar />
			<div style={{ maxWidth: "450px" }} className="mt-4 card mx-auto">
				<form className="mx-4 card-body" onSubmit={handleSubmit}>
					<h3 className="text-start card-title pt-4 pb-3">Create Account</h3>
					{error && (
						<div className="p-2 alert alert-danger" role="alert">
							<i className="bi bi-exclamation-triangle-fill mx-1"></i>
							{error}
						</div>
					)}
					{success && (
						<div className="p-2 alert alert-success" role="alert">
							<i className="bi bi-check-circle-fill mx-1"></i> Success
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
					<div className="position-relative w-100" ref={videoParentRef}>
						<CamPreview />
					</div>
					<div className="d-grid mt-3">
						<button type="submit" disabled={loading} className="btn btn-primary">
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
						<Link to="/signup" className="link-primary text-decoration-none"> Sign Up</Link>
					</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Signup;

