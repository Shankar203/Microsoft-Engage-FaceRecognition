const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-white">
			<div className="container-sm">
				<a className="navbar-brand" href="/">
					<h3>Face Recognition</h3>
				</a>
				<a href="https://github.com/Shankar203/Microsoft-Engage-FaceRecognition" className="nav-link">
					<img
						title="view docs"
						width={30}
						src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
						alt="github"
					/>
				</a>
			</div>
		</nav>
	);
};

export default Navbar;
