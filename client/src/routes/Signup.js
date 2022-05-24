import { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CamPreview from "../components/CamPreview";

const Signup = () => {
	const emailRef = useRef()
	const nameRef = useRef()
	const videoParentRef = useRef();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const getImage = () => {
		const canvas = document.createElement("canvas");
		canvas.width = videoParentRef.current.firstElementChild.videoWidth;
		canvas.height = videoParentRef.current.firstElementChild.videoHeight;
		const canvasCtx = canvas.getContext("2d");
		canvasCtx.drawImage(videoParentRef.current.firstElementChild, 0, 0);
		const imgURL = canvas.toDataURL();
		return imgURL;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData()
		formData.append("email", emailRef.current.value)
		formData.append("name", nameRef.current.value)
		formData.append("pic", getImage())
		const res = await axios.post("http://localhost:3080/api/user/signup/", formData)
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
						required
						ref={emailRef}
						disabled={loading}
					/>
					<input
						type="text"
						className={"form-control my-3" + (error && " is-invalid")}
						placeholder="name"
						required
						ref={nameRef}
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
							Sign Up
						</button>
					</div>
					<div className="mt-3 text-center text-muted">
						<span>
							Already have an account?
							<Link to="/login" className="link-primary text-decoration-none">
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

export default Signup;
