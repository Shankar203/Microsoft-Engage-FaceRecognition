import { useCallback, useState } from "react";
import { imageCapturer } from "../components/imageCapturer";

const useCaptureFacePoses = ({ videoParentRef }) => {
	const [facePoses, setFacePoses] = useState([]);

	const captureFacePoses = useCallback(async () => {
		if (facePoses.length < 5) {
			const imgFile = await imageCapturer({ videoParentRef });
			setFacePoses((imgArr) => imgArr.concat(imgFile));
		}
	}, [facePoses]);

	return [facePoses, captureFacePoses];
};

export default useCaptureFacePoses;
