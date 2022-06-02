const tf = require("@tensorflow/tfjs-node");
const { ArcFaceModel, YOLOv5Model } = require("./loadModels.js");


/**
 * Best Configuration for Model Inference, Input shape on 
 * which arcface, yolov5 were trained on are 112, 640. And 
 * Corresponding confidence are 0.68, 0.4
 */
const ArcFace_INPUT_SHAPE = [112, 112];
const YOLOv5_INPUT_SHAPE  = [640, 640];
const ArcFace_THRESHOLD   = 0.68;
const YOLOv5_THRESHOLD    = 0.40;


/**
 * Preprocess image to desired config, on which model was trained
 * 
 * Change dtype of the img from uint8 to float32, Now resize the img 
 * to desired target size, Add extra dimension over axis zero, Finally 
 * rescale the whole img to the range 0,1.
 * 
 * @param {tf.uint8} img shape: (h,w,3) img that has to be preprocessed
 * @param {tf.int32} tarSize [x,y] shape of the target img
 * @returns {tf.float32} shape: (1,x,y,3) final preprocessed img
 */
const processImg = (img, tarSize) => {
	img = tf.cast(img, "float32");
	img = resizeImg(img, tarSize);
	img = tf.expandDims(img, 0);
	img = tf.div(img, 255);
	return img;
};


/**
 * Crop the facial portion of image, and resize to tar shape
 * 
 * Use getBBox to get generate bbox for the img using yolov5, as yolo outputs
 * coordinates in the range 0,1, multiply it with yolov5_input_shape to get 
 * coordinates in the range (h,w), now slice the img to extract facial part
 * 
 * @param {tf.uint8} img shape: (h,w,3) img for which face has to be cropped
 * @returns {tf.uint8} shape: (640,640,3) extracted facial portion
 */
const getFace = async (img) => {
	var bbox = await getBBox(img);
	var idxs = bbox.mul(YOLOv5_INPUT_SHAPE[0]).cast("int32");
	var [x1, y1, x2, y2] = idxs.arraySync();
	var img = resizeImg(img, YOLOv5_INPUT_SHAPE);
	img = tf.slice(img, [y1, x1], [y2 - y1, x2 - x1]);
	return img;
};


/**
 * Resize image without disturbing the aspect ratio, imp for best results
 * 
 * Take max of the two dims and subtract it with the alternate one, and divide 
 * it by two to extra pad length, use tf.pad to pad with zeros over dims maintaining
 * the ascept ratio, use resizebillinear to be more exact.
 * 
 * @param {tf.float32} img shape: (h,w,3) input img that has to be resized
 * @param {tf.int32} tarSize shape: [x,x] size to which img has to be resized
 * @returns {tf.float32} shape: (x,x,3) image which was resized
 */
const resizeImg = (img, tarSize) => {
	var [h, w] = img.shape;
	var maxDim = Math.max(h, w);
	var padh = parseInt((maxDim - h) / 2);
	var padw = parseInt((maxDim - w) / 2);
	img = tf.pad(img, [[padh,padh],[padw, padw],[0,0]]);
	img = tf.image.resizeBilinear(img, tarSize);
	return img;
};


/**
 * Find the cosine similarity between two vectors
 * 
 * First find the norm of two vectors and divide them with their norms 
 * to find corresponding unit vectors, now find dot product between them to
 * get cosine similarity.
 * 
 * @param {tf.float64} ebd1 shape: (512,) facial embedding vector 1
 * @param {tf.float64} ebd2 shape: (512,) facial embedding vector 2
 * @returns {constant} similarity score between two vectors
 */
const cosineDistance = (ebd1, ebd2) => {
	ebd1 = tf.div(ebd1, ebd1.norm());
	ebd2 = tf.div(ebd2, ebd2.norm());
	return tf.losses.cosineDistance(ebd1, ebd2);
};


/**
 * Generate bbox of the facial region, including hair and ears
 * 
 * First preprocess the img and run it's inference over yolov5 model, it outputs bboxes 
 * of form [xmin,ymin,xmax,ymax] now gather all boxes, scores of class 1 (faces class), 
 * if scores length is zero or scores are less than a treshold throw error could'nt detect 
 * a face, now output bbox with highest treshold.
 * 
 * @param {tf.uint8} img shape: (h,w,3) input img for which bbox is to be detected
 * @returns {tf.float32} [xmin,ymin,xmax,ymax] bbox corresponding to that image
 */
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


/**
 * Generate Facial Embeddings corresponding to the image
 * 
 * First preprocess the img and run it's inference over arcface keras model, now
 * tf.szueeze to remove it's extra dimension.
 * 
 * @param {tf.uint8} img shape: (h,w,3) img for which ebd has to be generated
 * @returns {tf.float64} shape: (512,) generated facial embeddings
 */
const getEmbeddings = async (img) => {
	var img = processImg(img, ArcFace_INPUT_SHAPE);
	var model = await ArcFaceModel;
	var ebd = model.predict(img);
	return ebd.squeeze();
};


/**
 * get dist between two images img1, img2
 * 
 * Generate facial embeddings corresponding to the images, and find
 * cosineDistance between them.
 * 
 * @param {tf.uint8} img1 shape: (h,w,3) img1 to be compared
 * @param {tf.uint8} img2 shape: (h,w,3) img2 to be compared
 * @returns 
 */
const compareImgs = async (img1, img2) => {
	var ebd1 = await getEmbeddings(img1);
	var ebd2 = await getEmbeddings(img2);
	var dist = cosineDistance(ebd1, ebd2);
	return dist;
};


/**
 * Generate Unified Facial Embeddings corresponding to the imgBuffer
 * 
 * First use tf.node.decodeImage to decode imgBuffer to uint8 arr, now pass 
 * it to getFace to extract facial part in img and now use getEmbeddings
 * to generate facial embeddings.
 * 
 * @param {ArrayBuffer} imgBuffer Bytes Array of img encoded in png format
 * @returns {tf.float64} shape: (512,) Generated facial Embeddings
 */
const getFacialEmbeddings = async (imgBuffer) => {
	var img = tf.node.decodeImage(imgBuffer, (channels = 3));
	var imgFace = await getFace(img);
	var imgEbd  = await getEmbeddings(imgFace);
	return imgEbd;
};


/**
 * Compare the image with the embeddings generated during login
 * 
 * First use tf.node.decodeImage to decode imgBuffer to uint8 arr, now pass it to getFace 
 * and getEmbeddings to get corresponding embeddings to the facial part. Use cosineDistance
 * to compare img with anchorEmbeddings.
 * 
 * @param {tf.float64} anchorEbd shape: (512,) embeddings registered during signup
 * @param {ArrayBuffer} imgBuffer Bytes Array of img encoded in png format
 * @param {float} threshold treshold to which img can be compared
 * @returns {boolean} similarity score of comparision
 */
const compare = async (anchorEbd, imgBuffer, threshold = ArcFace_THRESHOLD) => {
	var img = tf.node.decodeImage(imgBuffer, (channels = 3));
	var anchorEbd = tf.tensor(anchorEbd);
	var imgFace = await getFace(img);
	var imgEbd  = await getEmbeddings(imgFace);
	var cosDist = cosineDistance(anchorEbd, imgEbd);
	var similar = cosDist.arraySync() <= threshold;
	return similar;
};

module.exports = { compare, compareImgs, getFacialEmbeddings };
