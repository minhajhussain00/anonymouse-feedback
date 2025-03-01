import mongoose from "mongoose"

type ConnectionObject = {
    isConnected ?:number
}

const connection:ConnectionObject = {}

async function dbConnection():Promise<void> {
    if(connection.isConnected){
        console.log("Using existing connection")
        return
    }
    try {
       const db = await mongoose.connect(process.env.MONGO_URI || "" ,{})
      connection.isConnected =  db.connections[0].readyState
      console.log('====================================');
      console.log("    Connected to database");
      console.log('===================================='); 
    } catch (error) {
        console.error("Error while connecting to database",error)
        process.exit(1)
    }
}
export default dbConnection