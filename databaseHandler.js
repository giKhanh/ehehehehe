const { MongoClient, ObjectId } = require("mongodb");

const DATABASE_URL =
  "mongodb+srv://giakhanh:1@cluster0.tvqnxsk.mongodb.net/test";
const DATABASE_NAME = "giakhanh";

//vi du obj la thong tin can insert,
//collection: ten cua bang can insert-vd Products
//insert san pham
async function insertToDB(obj, collectionName) {
  // ham ket noi
  const dbo = await getdbo();
  const result = await dbo.collection(collectionName).insertOne(obj);
  console.log("gia tri id moi duoc insert la:", result);
}

//hien thi toan bo san pham
async function getAll(collectionName) {
  //trong truong hop nay collection lis products
  // ham ket noi
  const dbo = await getdbo();
  const result = await dbo.collection(collectionName).find({}).toArray();
  return result;
}

// async function getAll(collectionName){
//     const dbo = await getdbo();
//     const result = await dbo.collection(collectionName).find({price: {$gt: 50}}).toArray();
//     return result;
// }

//delete product
async function deleteObject(id, collectionName) {
  const dbo = await getdbo();
  dbo.collection(collectionName).deleteOne({ _id: ObjectId(id) });
}
//edit product
async function getDocumentById(id, collectionName) {
  const dbo = await getdbo();
  const result = await dbo
    .collection(collectionName)
    .findOne({ _id: ObjectId(id) });
  return result;
}

//update product
async function updateDocument(id, updateValues, collectionName) {
  const dbo = await getdbo();
  await dbo
    .collection(collectionName)
    .updateOne({ _id: ObjectId(id) }, updateValues);
}

module.exports = {
  insertToDB,
  getAll,
  deleteObject,
  getDocumentById,
  updateDocument,
};

async function getdbo() {
  const client = await MongoClient.connect(DATABASE_URL);
  const dbo = client.db(DATABASE_NAME);
  return dbo;
}
