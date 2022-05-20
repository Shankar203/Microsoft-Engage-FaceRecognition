const tf = require("@tensorflow/tfjs-node");

const ArcFace_MODEL_PTH = "file://./face_recognition/arcface/model.json";
const YOLOv5_MODEL_PTH = "file://./face_recognition/yolov5/model.json";

async function load_YOLOv5_Model() {
	const YOLOv5Model = await tf.loadGraphModel(YOLOv5_MODEL_PTH);
	return YOLOv5Model;
}
async function load_ArcFace_Model() {
	const ArcFaceModel = await tf.loadLayersModel(ArcFace_MODEL_PTH);
	return ArcFaceModel;
}

module.exports.YOLOv5Model = load_YOLOv5_Model();
module.exports.ArcFaceModel = load_ArcFace_Model();
