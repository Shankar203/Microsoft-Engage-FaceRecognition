import { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CamPreview from "../components/CamPreview";

const Signup = () => {
	const emailRef = useRef()
	const videoParentRef = useRef();
	const fileRef = useRef();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const getImage = () => {
		const canvas = document.createElement("canvas");
		canvas.width = videoParentRef.current.firstElementChild.videoWidth;
		canvas.height = videoParentRef.current.firstElementChild.videoHeight;
		const canvasCtx = canvas.getContext("2d");
		canvasCtx.drawImage(videoParentRef.current.firstElementChild, 0, 0);
		return canvas
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// const res = await axios.get("http://localhost:3080/")
		// console.log(res);
		// const canvas = getImage()
		const formData = new FormData()
		formData.append("email", emailRef.current.value)
		formData.append("pic", fileRef.current.files[0])
		// canvas.toBlob((blob) => {
			// 	formData.append("pic", blob)
			// })
			// const res = await axios.post("http://localhost:3080/api/user/login/", formData)
			const res = await axios({
				method: 'POST',
				url: "http://localhost:3080/api/user/login",
				data: formData,
				// headers: {
				// 	'Content-Type': 'application/json'
				// },
				withCredentials: true
			})
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
					<input
						type="file"
						className={"form-control my-3" + (error && " is-invalid")}
						placeholder="pic"
						name="pic"
						required
						ref={fileRef}
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
