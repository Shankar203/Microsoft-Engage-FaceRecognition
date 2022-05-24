import { useEffect } from "react";

const useCamFeedSetter = ({ videoRef }) => {
	useEffect(() => {
		if (videoRef.current) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((stream) => (videoRef.current.srcObject = stream))
				.catch(console.error);
		}
		return () => {
			if (videoRef.current)
				if (videoRef.current.srcObject)
					videoRef.current.srcObject.getVideoTracks()[0].stop();
		}
	}, []);
};

export default useCamFeedSetter;
