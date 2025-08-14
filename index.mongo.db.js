// MongoDB schema and helper functions for collaborative document editor
// Requires: npm install mongoose

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collabeditor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const docSchema = new mongoose.Schema({
  text: String,
});

const Doc = mongoose.model('Doc', docSchema);

// Load or create the document in DB
async function getOrCreateDocument() {
  let doc = await Doc.findOne();
  if (!doc) {
    doc = new Doc({ text: '' });
    await doc.save();
  }
  return doc;
}

// Update document text in DB
async function updateDocumentText(newText) {
  await Doc.findOneAndUpdate({}, { text: newText });
}

module.exports = {
  getOrCreateDocument,
  updateDocumentText,
};
