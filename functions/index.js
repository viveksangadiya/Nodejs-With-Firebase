const functions=require('firebase-functions');
const admin=require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vue-practice-33f35-default-rtdb.firebaseio.com"
});

const express=require('express');
const cors=require('cors');
const db=admin.firestore();

const app=express();
app.use(cors({origin:true}));

app.get("/",(req,res)=>{
    return res.status(200).send("Hello")
})

//post data
app.post("/api/create", (req,res)=>{
    (async ()=> {
       try {
        await db.collection('Users').doc(`${Date.now()}`).create({
            id:Date.now(),
            name:req.body.name,
            mobile:req.body.mobile,
            address:req.body.address
        });

        return res.status(200).send({status:"Success" , message:"Data Added Successfully"});
       } catch (error) {
         console.log(error)
         return res.status(500).send({status:"failed" , message:error})
       }
    })();
})

//get particular id data
app.get("/api/get/:id",(req,res)=>{
    (async()=>{
      try {
        const reqData=db.collection('Users').doc(req.params.id);
        let data=await reqData.get();
        const response=data.data();

        return res.status(200).send({status:"Success",data:response})
      } catch (error) {
        return res.status(500).send({status:"failed",data:error})
      }
    })()
})

//get all data 
app.get("/api/getAll",(req,res)=>{
    (async()=>{
       try {
        const query=db.collection('Users');
        let response=[];
        await query.get().then((data)=>{
            let docs=data.docs;

            docs.map((doc)=>{
                const selectedItem={
                    name:doc.data().name,
                    mobile:doc.data().mobile,
                    address:doc.data().address
                }
                response.push(selectedItem)
            })
            return response;
        })
        return res.status(200).send({success:"Success",data:response})
       } catch (error) {
        return res.status(500).send({status:"failed",data:error})
       }
    })()
})

//update data
app.put("/api/update/:id",(req,res)=>{
    (async()=>{
       try {
        const reqData=db.collection('Users').doc(req.params.id);
        await reqData.update({
            name:req.body.name,
            mobile:req.body.mobile,
            address:req.body.address
        })
        return res.status(200).send({success:"Success",message:"Data updated successfully"})
       } catch (error) {
        return res.status(500).send({success:"Failed",message:error})
       }
    })()
})

//delete data
app.delete("/api/delete/:id",(req,res)=>{
    (async()=>{
       try {
        const reqData=db.collection('Users').doc(req.params.id);
        await reqData.delete()
        return res.status(200).send({success:"Success",message:"Data Deleted"})
       } catch (error) {
        return res.status(500).send({success:"Failed",message:error})
       }
    })()
})

////////////////////////////////////////////////////////////

//create form data 
app.post("/api/createForm",(req,res)=>{
    (async()=>{
       try {
         await db.collection('Students').doc().create({
            id:req.body.id,
            fname:req.body.fname,
            lname:req.body.lname,
            address:req.body.address,
            gender:req.body.gender,
            state:req.body.state,
            city:req.body.city,
            pincode:req.body.pincode,
            course:req.body.course,
            email:req.body.email,
         })
         return res.status(200).send({Success:"Success",message:"Data Added successfully"})
       } catch (error) {
        return res.status(500).send({Success:"Failed",message:error})
       }
    })()
})

//get all data
app.get("/api/getAllStudent",(req,res)=>{
    (async()=>{
      try {
        const query=db.collection('Students')
        let response=[];
        await query.get().then((data)=>{
            let docs=data.docs;

            docs.map((doc) =>{
                const selectedItem={
                    id:doc.id,
                    fname:doc.data().fname,
                    lname:doc.data().lname,
                    address:doc.data().address,
                    gender:doc.data().gender,
                    state:doc.data().state,
                    city:doc.data().city,
                    pincode:doc.data().pincode,
                    course:doc.data().course,
                    email:doc.data().email,
                }
               response.push(selectedItem)
            })     
            return response       
        })
        return res.status(200).send({Success:"Success",data:response})
      } catch (error) {
        return res.status(500).send({Success:"Failed",data:error})
      }
    })()
})

//get particular data
app.get("/api/getData/:id",(req,res)=>{
    (async()=>{
        try {
            const reqDoc=db.collection('Students').doc(req.params.id);
            let data=await reqDoc.get();
            const response=data.data();
            return res.status(200).send({Success:'Success',data:response})
        } catch (error) {
            return res.status(500).send({Success:'Failed',data:error})
        }
    })()
})

//update data
app.put("/api/updateData/:id",(req,res)=>{
      (async()=>{
         try {
            const reqDoc=db.collection('Students').doc(req.params.id);
            await reqDoc.update({
            id:req.body.id,
            fname:req.body.fname,
            lname:req.body.lname,
            address:req.body.address,
            gender:req.body.gender,
            state:req.body.state,
            city:req.body.city,
            pincode:req.body.pincode,
            course:req.body.course,
            email:req.body.email,
            })
            return res.status(200).send({Success:"Success",message:"Data Updated"})
         } catch (error) {
            return res.status(500).send({Success:"Failed",message:error})
         }
      })() 
})

//Delete data
app.delete("/api/deleteData/:id",(req,res)=>{
    (async()=>{
      try {
        const reqDoc=db.collection('Students').doc(req.params.id);
        await reqDoc.delete();
        return res.status(200).send({Success:"Success",message:"Data Deleted"})
      } catch (error) {
        return res.status(500).send({Success:"Success",message:error})
      }
    })()
})

/////////////////////////////////////////////////////////////////

//Add messages
app.post("/Students/:id/Messages",(req,res)=>{
    (async()=>{
       try {
        const id=req.params.id;
        const parentCollectionRef = db.collection("Students");
        const newDocumentRef = parentCollectionRef.doc(id);
        const subCollectionRef = newDocumentRef.collection("Messages");
        const data = { msg: req.body };
        await subCollectionRef.doc().create(data);        
        return res.status(200).send({Success:"Success",message:"Data Added successfully"})
       } catch (error) {
        return res.status(500).send({Success:"Failed",message:error})
       }
    })()
})

// get all messages of particular student
app.get("/Students/:id/Messages",(req,res)=>{
    (async()=>{
        try {
            let studentId=req.params.id;
            const query=await db.collection(`Students/${studentId}/Messages`).get();
            let msgList=query.docs.map((doc)=>{
                let data={...doc.data().msg};
                return data;
            })
            // let msgList=req.docs.map((doc)=> doc.data().msg.msg).join(', ')
            return res.status(200).send({Status:"Success",data:msgList})
        } catch (error) {
            return res.status(500).send({Success:"Failed",message:error})
        }
    })()
})

//update message
app.put("/Students/:id/Messages", async (req, res) => {
    try {
      const studentId = req.params.id;
      const newMessageContent = "vivek sangadiya"; // Update the message content as needed
  
      // Query to find the message document with the specific content
      const querySnapshot = await db.collection(`Students/${studentId}/Messages`).where("msg.msg", "==", "vivek").get();
  
      if (querySnapshot.empty) {
        return res.status(404).send({ Status: "Failed", message: "Message not found" });
      }
  
      // Update the first found message in the database
      const docRef = querySnapshot.docs[0].ref;
      await docRef.update({
        "msg.msg": newMessageContent
      });
  
      return res.status(200).send({ Status: "Success", message: "Message updated successfully" });
    } catch (error) {
      return res.status(500).send({ Status: "Failed", message: error });
    }
  });
  

exports.app=functions.https.onRequest(app);