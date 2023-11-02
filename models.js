import mongoose from 'mongoose';

let models = {};

main().catch(err => console.log(err))
async function main(){
    console.log('connecting to mongodb')
    await mongoose.connect('mongodb+srv://minhmai2304:minhmai2304@datacore.ajydxh0.mongodb.net/?retryWrites=true&w=majority')

    console.log('successfully connected to mongodb!')

    const postSchema = new mongoose.Schema({
        username: String,
        url: String,
        description: String,
        created_date: {type: Date, default: Date.now}
    })

    models.Post = mongoose.model('Post', postSchema)
    console.log('mongoose models created')
}

export default models;