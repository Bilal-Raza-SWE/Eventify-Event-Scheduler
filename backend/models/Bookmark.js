const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    bookmarkedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);
module.exports = Bookmark;