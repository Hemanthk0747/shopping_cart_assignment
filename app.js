const express=require('express');
const cors=require('cors');
const jsonData=require('./db.json');
const app=express();
app.use(express.json());
app.use(cors());

let customerCart=[];

app.get("/products/",(request, response)=>{
  const listOfProducts=jsonData.products;
  response.send(listOfProducts);
  response.status(200);
});

app.post("/productCart/add/:productId/",(request, response)=>{
  let {quantity}=request.query;
  let {productId}=request.params;
  quantity=quantity===undefined?1:parseInt(quantity);
  const product=jsonData.products.find(item=>item.id===productId);
  if(product!=undefined){
    if(customerCart.find(ele=>ele.id===productId)){
      customerCart=customerCart.map(ele=>{
        if(ele.id===productId){
          return {...ele, quantity:parseInt(ele.quantity)+quantity};
        }
        return ele
      })
    } else{
      customerCart.push({...product,quantity});
    }
    response.status(200).send({message: "Product added successfully."+` quantity: ${quantity} added`});
  } else{
    response.status(400).send({message:"product not available in products."});
  }
});

app.get("/productCart/items",(request, response)=>{
  let totalPrice=0;
  let subTotalPrice=0;
  customerCart.forEach(ele=>{
    subTotalPrice+=ele.quantity*parseFloat(ele.price);
  })
  subTotalPrice=Math.round(subTotalPrice*100)*0.01;
  console.log(subTotalPrice/100);
  totalPrice=subTotalPrice+Math.round(subTotalPrice*.125,2);
  response.status(200).send({customerCart,subTotalPrice,totalPrice});
})

app.get("/products/:productId", (request, response)=>{
  const {productId}=request.params;
  const product=jsonData.products.find(item=>item.id==productId);
  if(product != undefined){
    response.status(200);
    response.send(JSON.stringify(product));
  } else{
    response.status(400).send({message: "No product available with that given product id"});
  }
}); 
let port=3001;
app.listen(port,()=>{console.log("server is running the local host: "+port)});