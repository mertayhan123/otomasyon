import mongoose from 'mongoose';

const buttonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Button = mongoose.models.Button || mongoose.model('Button', buttonSchema);

export default Button;