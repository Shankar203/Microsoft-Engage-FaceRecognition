const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const path = require("path");

var img1 = fs.readFileSync(path.resolve(__dirname, "./asserts/Amanda Crew0_0.jpg"));
var img2 = fs.readFileSync(path.resolve(__dirname, "./asserts/Amanda Crew107_7.jpg"));

const processImg = (img) => {
	img = tf.node.decodeImage(img);
	img = tf.cast(img, "float32");
	img = tf.image.resizeBilinear(img, [112, 112]);
	img = tf.expandDims(img, 0);
	img = tf.div(img, 255);
	return img;
};

const cosineDistance = (ebd1, ebd2) => {
	ebd1 = tf.div(ebd1, ebd1.norm());
	ebd2 = tf.div(ebd2, ebd2.norm());
	return tf.losses.cosineDistance(ebd1, ebd2);
};

const compare = async (img1, img2) => {
	const model = await tf.loadLayersModel("file://./arcface/model.json");
	const ebd1 = model.predict(processImg(img1));
	const ebd2 = model.predict(processImg(img2));
	const dist = cosineDistance(ebd1, ebd2);
	return dist;
};

compare(img1, img2);
