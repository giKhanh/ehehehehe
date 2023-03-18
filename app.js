const express = require("express");
const {
  insertToDB,
  getAll,
  deleteObject,
  getDocumentById,
  updateDocument,
} = require("./databaseHandler");
const app = express();

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true })); //doc du lieu nguoi dung giui toi

const hbs = require("hbs");
hbs.registerHelper("pricecheck", function (price) {
  if (price >= 50) {
    return "red";
  } else  (price >= 70) 
    return "green";
  
});
const path = require("path");
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

function formatDate(date) {
  return new Date(date).toLocaleString("vi-VN");
}

app.get("/", async (req, res) => {
  var result = await getAll("Products");
  var time = new Date().toISOString();
  res.render("home", { products: result, now: formatDate(time) });
});

app.get("/", async (req, res) => {
  var result = await getAll("Products"); //Product from NoSQL
  res.render("home", { products: result });
});

app.get("/views", async (req, res) => {
  var result = await getAll("Products");
  res.render("views", { products: result });
});

app.post("/insert", async (req, res) => {
  //req chua toan bo thong tin nguoi dung ;res thong tin gui ve cho nguoi dung
  const name = req.body.txtName;
  const price = Number.parseInt(req.body.txtPrice);
  const url = req.body.txtURL;
  const quantity = req.body.txtQuantity;
  const category = req.body.txtCategory 

  if (name.length < 5) {
    var result = await getAll("Products");
    res.render("home", {
      products: result,
      nameError: "have to insert name again",
    });
  } else if (url.length == 0 ) {  //|| url.endswith('jpg')
   
    var result = await getAll("Products");
    res.render("home", {
      products: result,
      picError: "have to insert Picture!",
    });
  } else if (isNaN( price )  || price <50 || price >70 //|| price < 50 || price > 70)  
  ){
    var result = await getAll("Products");
    res.render("home", {
      products: result,
      pricError: "have to insert price!",
    });
  } else if (isNaN(quantity) == true) {
    var result = await getAll("Products");
    res.render("home", {
      products: result,
      quantityError: "have to insert quantity again",
    });
  } else {
    //xay dung doi tuong insert
    const obj = { name: name, price: price, picURL: url, quantity: quantity , category: category}; //nhung thong tin can insert
    //xay dung doi tuong insert
    console.log(obj);
    await insertToDB(obj, "Products"); //goi ham de insert vao db , Products from NoSQL
    res.redirect("/"); // return home page
  }
});
app.get("/delete/:id", (req, res) => {
  const idproduct = req.params.id;
  //ham xoa product dua tren id
  deleteObject(idproduct, "Products");
  res.redirect("/"); // return home page
});

app.post("/update", async (req, res) => {
  const id = req.body.txtId;
  const name = req.body.txtName;
  const price = req.body.txtPrice;
  const quantity = req.body.txtQuantity;
  const category = req.body.txtCategory;
  const url = req.body.txtURL;

  //ham update
  let updateValues = {
    $set: { name: name, price: price, picURL: url, quantity: quantity },
  };
  await updateDocument(id, updateValues, "Products");
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const idproduct = req.params.id;
  //lay information old of product before edit
  const productoEdit = await getDocumentById(idproduct, "Products");
  //hien thi ra de sua
  res.render("edit", { product: productoEdit });
});

function formatdate(date) {
  return new Date(date).toLocaleString("vi-VN");
}
app.get("/", (req, res) => {
  var td = new Date().toISOString();
  res.render("home", { now: formatdate(td) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("server is running!");
