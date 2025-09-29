import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X } from 'lucide-react';
//import './App.css'; 

export default function App() {
    const [notes, setNotes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    useEffect(() => {
        try {
            const savedNotes = localStorage.getItem('react-notes-app-data');
            if (savedNotes) {
                setNotes(JSON.parse(savedNotes));
            }
        } catch (error) {
            console.error("Failed to load notes from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('react-notes-app-data', JSON.stringify(notes));
        } catch (error) {
            console.error("Failed to save notes to localStorage", error);
        }
    }, [notes]);

    //Operations (Create, Read, Update, Delete)

    const handleSaveNote = (note) => {
        if (note.id) { 
            const updatedNotes = notes.map((n) =>
                n.id === note.id ? { ...n, title: note.title, content: note.content } : n
            );
            setNotes(updatedNotes);
        } else { 
            const newNote = {
                id: crypto.randomUUID(), 
                title: note.title,
                content: note.content,
                createdAt: new Date().toISOString(),
            };
            
            const newNotes = [newNote, ...notes];
            setNotes(newNotes);
        }
        closeModal();
    };

    const handleDeleteNote = (id) => {
        const remainingNotes = notes.filter((note) => note.id !== id);
        setNotes(remainingNotes);
    };

    const openModal = (note = null) => {
        setCurrentNote(note);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentNote(null);
        setIsModalOpen(false);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div>
                    <h1>My Notes</h1>
                    
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={20} />
                    Add Note
                </button>
            </header>
            
            <main>
                {notes.length > 0 ? (
                    <div className="notes-grid">
                        {notes.map(note => (
                           <NoteCard key={note.id} note={note} onEdit={openModal} onDelete={handleDeleteNote} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h2>No notes yet!</h2>
                        <p>Click 'Add Note' to get started.</p>
                    </div>
                )}
            </main>

            <NoteModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveNote}
                note={currentNote}
            />
        </div>
    );
}

const NoteCard = ({ note, onEdit, onDelete }) => {
    return (
        <div className="note-card">
            <div className="note-card-content">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
            </div>
            <div className="note-card-footer">
                 <small>{new Date(note.createdAt).toLocaleDateString()}</small>
                <div className="note-card-actions">
                    <button onClick={() => onEdit(note)} className="icon-btn">
                        <Edit size={18} className="icon-edit" />
                    </button>
                    <button onClick={() => onDelete(note.id)} className="icon-btn">
                        <Trash2 size={18} className="icon-delete" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const NoteModal = ({ isOpen, onClose, onSave, note }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [note]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(title.trim() === '' && content.trim() === '') return;
        onSave({ id: note?.id, title, content });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-btn">
                    <X size={24} />
                </button>
                <h2>{note ? 'Edit Note' : 'Add New Note'}</h2>
                <form onSubmit={handleSubmit} className="note-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note title"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="6"
                            placeholder="What's on your mind?"
                        ></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


