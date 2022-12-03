import mongoose, { mongo } from "mongoose";


const PostModel = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    unique: true
  },
  tags: {
    type: Array,
    default: []
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  avatarUrl: String,
}, {
  timestamps: true
})

export default mongoose.model('Post', PostModel);