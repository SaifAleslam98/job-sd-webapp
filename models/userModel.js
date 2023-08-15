const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'user name required']
    },
    slug: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'user email required'],
        unique: true,
        lowercase: true,
    },
    phone: {
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    gender: {
        type: String,
        enum: ['ذكر', 'انثي'],
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, 'user pasword required'],
        minlength: [6, 'user pasword minimum hould be 6'],
    },
    active: {
        type: Boolean,
        default: true
    },
    city:{
        type: String,
        required:true
    }
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = function (userpassword){
    return bcrypt.compareSync(userpassword,this.userPassword)
}
module.exports = mongoose.model('User', userSchema);