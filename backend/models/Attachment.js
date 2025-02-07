const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
    name: String,
    url: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


attachmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Attachment", attachmentSchema);