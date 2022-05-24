import { useRef } from "react";
import useCanvasUpdater from "../hooks/useCanvasUpdater";
import useCamFeedSetter from "../hooks/useCamFeedSetter";
import useFaceMeshResultsGetter from "../hooks/useFaceMeshResultsGetter";

const CamPreview = () => {
	const videoRef = useRef();
	const canvasRef = useRef();

	useCamFeedSetter({ videoRef });
	const faceMeshResults = useFaceMeshResultsGetter({ videoRef });
	useCanvasUpdater(faceMeshResults, { videoRef, canvasRef });

	return (
		<>
			<video className="w-100" autoPlay ref={videoRef} />
			{videoRef.current && (
				<canvas
					className="position-absolute top-0 start-0 w-100"
					width={videoRef.current.videoWidth}
					height={videoRef.current.videoHeight}
					ref={canvasRef}
				></canvas>
			)}
		</>
	);
};

export default CamPreview;
