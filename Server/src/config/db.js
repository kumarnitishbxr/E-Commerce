import mongoose from "mongoose"

async function main(){
   await mongoose.connect(process.env.DB_KEY)
}

export default main