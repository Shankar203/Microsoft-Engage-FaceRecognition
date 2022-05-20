const tf = require("@tensorflow/tfjs-node");
const { ArcFaceModel,  YOLOv5Model} = require("./loadModels.js")

const ArcFace_INPUT_SHAPE = [112, 112];
const YOLOv5_INPUT_SHAPE  = [640, 640];
const ArcFace_THRESHOLD   = 0.68;
const YOLOv5_THRESHOLD    = 0.40;

const processImg = (img, tarSize) => {
	img = tf.cast(img, "float32");
	img = resizeImg(img, tarSize);
	img = tf.expandDims(img, 0);
	img = tf.div(img, 255);
	return img;
};

const getFace = async (img) => {
	var bbox = await getBBox(img);
	var idxs = bbox.mul(YOLOv5_INPUT_SHAPE[0]).cast("int32");
	var [x1, y1, x2, y2] = idxs.arraySync();
	var img = resizeImg(img, YOLOv5_INPUT_SHAPE);
	img = tf.slice(img, [y1, x1], [y2 - y1, x2 - x1]);
	return img;
};

const resizeImg = (img, tarSize) => {
	var [h, w] = img.shape;
	var maxDim = Math.max(h, w);
	var padh = parseInt((maxDim - h) / 2);
	var padw = parseInt((maxDim - w) / 2);
	img = tf.pad(img, [[padh,padh],[padw, padw],[0,0]]);
	img = tf.image.resizeBilinear(img, tarSize);
	return img;
};

const cosineDistance = async (ebd1, ebd2) => {
	ebd1 = tf.div(ebd1, ebd1.norm());
	ebd2 = tf.div(ebd2, ebd2.norm());
	return tf.losses.cosineDistance(ebd1, ebd2);
};

const getBBox = async (img) => {
	var img = processImg(img, YOLOv5_INPUT_SHAPE);
	var model = await YOLOv5Model;
	var [bboxes, scores, classes, valid_detections] = await model.executeAsync(img);
	bboxes = await tf.booleanMaskAsync(bboxes.gather(0), classes.gather(0).equal(1));
	scores = await tf.booleanMaskAsync(scores.gather(0), classes.gather(0).equal(1));
	if (!scores.shape[0]) throw new Error("Could'nt detect a Face");
	if (scores.max().arraySync() <= YOLOv5_THRESHOLD) throw new Error("Could'nt detect a Face");
	var bbox = bboxes.gather(scores.argMax());
	return bbox;
};

const getEmbeddings = async (img) => {
	var img = processImg(img, ArcFace_INPUT_SHAPE);
	var model = await ArcFaceModel;
	var ebd = model.predict(img);
	return ebd.squeeze();
};

const compareImgs = async (img1, img2) => {
	var ebd1 = await getEmbeddings(img1);
	var ebd2 = await getEmbeddings(img2);
	var dist = cosineDistance(ebd1, ebd2);
	return dist;
};

const getFacialEmbeddings = async (imgBuffer) => {
	var img = tf.node.decodeImage(imgBuffer, (channels = 3));
	var imgFace = await getFace(img);
	var imgEbd  = await getEmbeddings(imgFace);
	return imgEbd;
};

const compare = async (anchorEbd, imgBuffer, threshold = ArcFace_THRESHOLD) => {
	var img = tf.node.decodeImage(imgBuffer, (channels = 3));
	var anchorEbd = tf.tensor(anchorEbd);
	var imgFace = await getFace(img);
	var imgEbd  = await getEmbeddings(imgFace);
	var cosDist = await cosineDistance(anchorEbd, imgEbd);
	var similar = (await cosDist.array()) <= threshold;
	return similar;
};

module.exports = { compare, compareImgs, getFacialEmbeddings };
