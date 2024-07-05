const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let notes = [];

app.post('/add-note', (req, res) => {
  const { title, content } = req.body;
  const note = { id: Date.now(), title, content };
  notes.push(note);
  res.send(`
    <div class="note" id="note-${note.id}">
      <h2>${note.title}</h2>
      <p>${note.content}</p>
      <button class="delete-btn" hx-delete="/delete-note/${note.id}" hx-target="#note-${note.id}" hx-swap="outerHTML">Delete</button>
    </div>
  `);
});

app.delete('/delete-note/:id', (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  notes = notes.filter(note => note.id !== noteId);
  res.send('');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
