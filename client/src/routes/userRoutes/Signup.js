import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import CamPreview from "../../components/CamPreview";
import useCaptureFacePoses from "../../hooks/useCaptureFacePoses";

const Signup = () => {
	const emailRef = useRef();
	const nameRef = useRef();
	const videoParentRef = useRef();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [facePoses, captureFacePoses] = useCaptureFacePoses({ videoParentRef });

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			const formData = new FormData();
			formData.append("email", emailRef.current.value);
			formData.append("name", nameRef.current.value);
			formData.append("pic", facePoses.at(-1));
			const res = await axios.post("https://microsoft-engage-facerecognition.azurewebsites.net/signup/", formData, {
				withCredentials: true,
			});
			setSuccess(res.data.msg);
			setLoading(false);
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
			<div style={{ maxWidth: "450px" }} className="mt-3 card mx-auto">
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
							<i className="bi bi-check-circle-fill mx-1"></i>
							{success}
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
					<div className="fw-bold mb-1">Capture Different Poses:</div>
					<div className="w-100 gap-1 d-flex">
						<span>{facePoses.length}/5</span>
						<div className="progress my-1 w-100">
							<div
								className="progress-bar"
								style={{ width: facePoses.length * 20 + 1 + "%" }}
								role="progressbar"
								aria-valuenow={facePoses.length * 20 + 1}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
						</div>
					</div>
					<div className="position-relative w-100" ref={videoParentRef}>
						<CamPreview />
					</div>
					<div className="d-grid mt-3">
						{facePoses.length < 5 ? (
							<button type="button" onClick={captureFacePoses} className="btn btn-primary">
								Capture
							</button>
						) : (
							<button type="submit" disabled={loading || success} className="btn btn-primary">
								{loading && (
									<span
										className="spinner-grow spinner-grow-sm mx-1"
										role="status"
										aria-hidden="true"
									></span>
								)}
								Sign Up
							</button>
						)}
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
