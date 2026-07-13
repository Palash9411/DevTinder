const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: `{VALUE} is incorrect status type `
        }
    }
}, {
    timestamps: true
}
);
connectionRequestSchema.pre('save', async function () {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error('Cannot send connection request to yourself');
    }
});
const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequestModel;

