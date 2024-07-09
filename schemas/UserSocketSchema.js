import mongoose from 'mongoose';

const UserSocketSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  socketid: {
    type: String,
    required: true,
  },
});

export default UserSocketSchema;
