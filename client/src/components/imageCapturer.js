export const imageCapturer = async ({ videoParentRef }) => {
    const videoElement = videoParentRef.current.firstElementChild;
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext("2d").drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imgBlob = await new Promise((resolve) => canvas.toBlob(resolve));
    const file = new File([imgBlob], "pic.png", { type: "image/png" }, "image/png");
    return file;
};