import { useEffect, useState } from "react";
import { FACEMESH_TESSELATION } from "@mediapipe/face_mesh";
import { drawConnectors } from "@mediapipe/drawing_utils";

const useCanvasUpdater = (faceMeshResults, { videoRef, canvasRef }) => {
	const [[videoWidth, videoHeight], setVideoDims] = useState([640, 480]);

	useEffect(() => {
		try {
			setVideoDims([videoRef.current.videoWidth, videoRef.current.videoHeight]);
			if (faceMeshResults) {
				canvasRef.current.width = videoWidth;
				canvasRef.current.Height = videoHeight;
				const canvasCtx = canvasRef.current.getContext("2d");
				canvasCtx.save();
				canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
				faceMeshResults.multiFaceLandmarks.forEach((landmarks) => {
					drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
						color: "#C0C0C070",
						lineWidth: 1,
					});
				});
				canvasCtx.restore();
			}
		} catch (err) {
			console.error(err);
		}
	}, [faceMeshResults]);
};

export default useCanvasUpdater;
