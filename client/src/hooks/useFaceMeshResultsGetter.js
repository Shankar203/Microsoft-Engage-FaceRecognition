import { useEffect, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const useFaceMeshResultsGetter = ({ videoRef }) => {
	const [faceMeshResults, setFaceMeshResults] = useState();

	useEffect(() => {
		try {
			if (videoRef.current) {
				const faceMesh = new FaceMesh({
					locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
				});
				faceMesh.setOptions({
					maxNumFaces: 1,
					refineLandmarks: true,
					minDetectionConfidence: 0.5,
					minTrackingConfidence: 0.5,
				});
				faceMesh.onResults(setFaceMeshResults);
				const camera = new Camera(videoRef.current, {
					onFrame: async () => await faceMesh.send({ image: videoRef.current }),
					width: videoRef.current.videoWidth,
					height: videoRef.current.videoHeight,
				});
				camera.start();
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	return faceMeshResults;
};

export default useFaceMeshResultsGetter;
