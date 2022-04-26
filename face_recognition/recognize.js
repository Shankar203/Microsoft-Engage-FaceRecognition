const tf = require("@tensorflow/tfjs-node");

const ArcFace_MODEL_PTH = "file://./face_recognition/arcface/model.json";
const ArcFace_INPUT_SHAPE = [112, 112];
const ArcFace_THRESHOLD = 0.68;

const processImg = (imgBuf) => {
	var img = tf.node.decodeImage(imgBuf);
	img = tf.cast(img, "float32");
	img = tf.image.resizeBilinear(img, ArcFace_INPUT_SHAPE);
	img = tf.expandDims(img, 0);
	img = tf.div(img, 255);
	return img;
};

const cosineDistance = async (ebd1, ebd2) => {
	ebd1 = tf.div(ebd1, ebd1.norm());
	ebd2 = tf.div(ebd2, ebd2.norm());
	return tf.losses.cosineDistance(ebd1, ebd2);
};

const getEmbeddings = async (imgBuf, path = ArcFace_MODEL_PTH) => {
	var model = await tf.loadLayersModel(path);
	var img = processImg(imgBuf);
	var ebd = model.predict(img);
	var ebd = tf.reshape(ebd, [-1])
	return ebd;
};

const compareImgs = async (img1, img2) => {
	var ebd1 = await getEmbeddings(img1);
	var ebd2 = await getEmbeddings(img2);
	var dist = cosineDistance(ebd1, ebd2);
	return dist;
};

const compare = async (anchorEbd, imgBuffer, threshold = ArcFace_THRESHOLD) => {
	var imgEbd = await getEmbeddings(imgBuffer);
	var cosDist = await cosineDistance(anchorEbd, imgEbd);
	var similar = await cosDist.array() <= threshold;
	return similar;
};

module.exports = { compare, compareImgs, getEmbeddings };
