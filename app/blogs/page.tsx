
'use client';

import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import { useState, useContext, useEffect, useRef } from 'react';
import { BlogContext } from '../../context/BlogContext';
import { AuthContext } from '../../context/AuthContext';


// Lexical Imports
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode, ListItemNode, ListNode, ParagraphNode, TextNode, LineBreakNode } from '@lexical/nodes';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $getSelection, EditorState } from 'lexical';

// Lexical Editor Theme (basic)
const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  paragraph: 'mb-1',
  // Add other styles as needed
};

// Lexical Editor Config
const editorConfig = {
  namespace: 'BlogEditor',
  theme,
  onError(error: Error) {
    console.error(error);
  },
  nodes: [
    HeadingNode,
    QuoteNode,
    ListItemNode,
    ListNode,
    ParagraphNode,
    TextNode,
    LineBreakNode,
  ],
};

// Toolbar Plugin (simplified for now)
function ToolbarPlugin({ editor }: { editor: any }) {
  const [activeEditor] = useLexicalComposerContext();
  const formatText = (format: string) => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if (selection) {
        selection.formatText(format);
      }
    });
  };

  return (
    <div className="toolbar mb-2 border p-2 rounded">
      <button onClick={() => formatText('bold')} className="btn btn-light btn-sm me-1">
        <b>B</b>
      </button>
      <button onClick={() => formatText('italic')} className="btn btn-light btn-sm me-1">
        <i>I</i>
      </button>
      <button onClick={() => formatText('underline')} className="btn btn-light btn-sm me-1">
        <u>U</u>
      </button>
      {/* Add more buttons as needed */}
    </div>
  );
}

// Helper to convert Lexical EditorState to HTML
function editorStateToHtml(editorState: EditorState): string {
  return editorState.read(() => $generateHtmlFromNodes());
}

// Helper to convert HTML to Lexical EditorState
function htmlToEditorState(html: string): EditorState {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/html');
  return EditorState.createEmpty().read(() => {
    const nodes = $generateNodesFromDOM(dom);
    $getRoot().select();
    $getRoot().append(...nodes);
  });
}

interface Blog {
  id: number;
  title: string;
  description: string; // This will now store HTML from Lexical
  image: string;
}

export default function Blogs() {
  const blogContext = useContext(BlogContext);
  const authContext = useContext(AuthContext);

  if (!blogContext || !authContext) {
    return <div>Loading...</div>;
  }

  const { blogs, addBlog, deleteBlog, editBlog } = blogContext;
  const { isAdmin } = authContext;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addBlog({
          title,
          description,
          image: reader.result as string,
        });
        setTitle('');
        setDescription('');
        setImage(null);
      };
      reader.readAsDataURL(image);
    }
  };

  const handleEditClick = (blog: Blog) => {
    setCurrentBlog(blog);
    setEditTitle(blog.title);
    setEditDescription(blog.description);
    setEditImage(null); // Clear previous image selection
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (currentBlog) {
      if (editImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          editBlog({
            ...currentBlog,
            title: editTitle,
            description: editDescription,
            image: reader.result as string,
          });
          setShowEditModal(false);
          setCurrentBlog(null);
          setEditImage(null);
        };
        reader.readAsDataURL(editImage);
      } else {
        // If no new image is selected, keep the existing one
        editBlog({
          ...currentBlog,
          title: editTitle,
          description: editDescription,
        });
        setShowEditModal(false);
        setCurrentBlog(null);
      }
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Blogs</h1>
      <Row>
        <Col md={isAdmin ? 8 : 12}>
          <h2>Latest Blogs</h2>
          {blogs.map((blog) => (
            <Card key={blog.id} className="mb-3">
              <Card.Img variant="top" src={blog.image} />
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text>
                  <ReactMarkdown components={{ p: ({ node, ...props }) => <span {...props} /> }}>{blog.description}</ReactMarkdown>
                </Card.Text>
                {isAdmin && (
                  <>
                    <Button variant="secondary" className="me-2" onClick={() => handleEditClick(blog)}>Edit</Button>
                    <Button variant="danger" onClick={() => deleteBlog(blog.id)}>Delete</Button>
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
        {isAdmin && (
          <Col md={4}>
            <h2>Post a Blog</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <div className="editor-wrapper border rounded p-2">
                  <LexicalComposer initialConfig={editorConfig}>
                    <ToolbarPlugin />
                    <div className="editor-inner">
                      <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<div className="editor-placeholder">Enter description...</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                      />
                      <HistoryPlugin />
                      <AutoFocusPlugin />
                      <OnChangePlugin onChange={(editorState) => {
                        setDescription(editorStateToHtml(editorState));
                      }} />
                    </div>
                  </LexicalComposer>
                </div>
              </Form.Group>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files ? e.target.files[0] : null)} required />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        )}
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="editFormTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editFormDescription">
              <Form.Label>Description</Form.Label>
              <div className="editor-wrapper border rounded p-2">
                <LexicalComposer initialConfig={{
                  ...editorConfig,
                  editorState: htmlToEditorState(editDescription),
                }}>
                  <ToolbarPlugin />
                  <div className="editor-inner">
                    <RichTextPlugin
                      contentEditable={<ContentEditable className="editor-input" />}
                      placeholder={<div className="editor-placeholder">Enter description...</div>}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <OnChangePlugin onChange={(editorState) => {
                      setEditDescription(editorStateToHtml(editorState));
                    }} />
                  </div>
                </LexicalComposer>
              </div>
            </Form.Group>
            <Form.Group controlId="editFormFile" className="mb-3">
              <Form.Label>Change Image (optional)</Form.Label>
              <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditImage(e.target.files ? e.target.files[0] : null)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
