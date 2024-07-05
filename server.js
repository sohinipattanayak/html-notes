const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

let notes = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/add-note', (req, res) => {
    const { title, content } = req.body;
    if (title && content) {
        const note = { id: notes.length + 1, title, content };
        notes.push(note);
        res.send(`
            <li id="note-${note.id}">
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <button class="edit-button" hx-get="/edit-note/${note.id}">Edit</button>
                <button class="delete-button" hx-delete="/delete-note/${note.id}">Delete</button>
            </li>
        `);
    } else {
        res.status(400).send('Title and content are required');
    }
});

app.get('/edit-note/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const note = notes.find(n => n.id === noteId);
    if (note) {
        res.send(`
            <li id="note-${note.id}">
                <form hx-put="/update-note/${note.id}">
                    <input type="text" name="title" value="${note.title}" required>
                    <textarea name="content" required>${note.content}</textarea>
                    <button type="submit">Update</button>
                </form>
            </li>
        `);
    } else {
        res.status(404).send('Note not found');
    }
});

app.put('/update-note/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const { title, content } = req.body;
    const note = notes.find(n => n.id === noteId);
    if (note) {
        note.title = title;
        note.content = content;
        res.send(`
            <li id="note-${note.id}">
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <button class="edit-button" hx-get="/edit-note/${note.id}">Edit</button>
                <button class="delete-button" hx-delete="/delete-note/${note.id}">Delete</button>
            </li>
        `);
    } else {
        res.status(404).send('Note not found');
    }
});

app.delete('/delete-note/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    notes = notes.filter(n => n.id !== noteId);
    res.send('');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
