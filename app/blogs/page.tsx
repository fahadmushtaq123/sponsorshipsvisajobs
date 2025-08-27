
'use client';

import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { BlogContext } from '../../context/BlogContext';
import { AuthContext } from '../../context/AuthContext';
import dynamic from 'next/dynamic';

// Define modules and formats for ReactQuill
const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
];

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

import { Blog } from '../../context/BlogContext'; // Import Blog interface

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
  const [imageWidth, setImageWidth] = useState<string>('');
  const [imageHeight, setImageHeight] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageWidth, setEditImageWidth] = useState<string>('');
  const [editImageHeight, setEditImageHeight] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addBlog({
          title,
          description,
          image: reader.result as string,
          imageWidth, // Add imageWidth
          imageHeight, // Add imageHeight
        });
        setTitle('');
        setDescription('');
        setImage(null);
        setImageWidth(''); // Reset imageWidth
        setImageHeight(''); // Reset imageHeight
      };
      reader.readAsDataURL(image);
    }
  };

  const handleEditClick = (blog: Blog) => {
    setCurrentBlog(blog);
    setEditTitle(blog.title);
    setEditDescription(blog.description);
    setEditImage(null); // Clear previous image selection
    setEditImageWidth(blog.imageWidth || ''); // Set current width
    setEditImageHeight(blog.imageHeight || ''); // Set current height
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
            imageWidth: editImageWidth, // Add editImageWidth
            imageHeight: editImageHeight, // Add editImageHeight
          });
          setShowEditModal(false);
          setCurrentBlog(null);
          setEditImage(null);
          setEditImageWidth(''); // Reset editImageWidth
          setEditImageHeight(''); // Reset editImageHeight
        };
        reader.readAsDataURL(editImage);
      } else {
        // If no new image is selected, keep the existing one
        editBlog({
          ...currentBlog,
          title: editTitle,
          description: editDescription,
          imageWidth: editImageWidth, // Add editImageWidth
          imageHeight: editImageHeight, // Add editImageHeight
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
              {blog.image && (
                <Card.Img
                  variant="top"
                  src={blog.image}
                  style={{ width: blog.imageWidth || '100%', height: blog.imageHeight || 'auto', objectFit: 'contain' }}
                />
              )}
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text dangerouslySetInnerHTML={{ __html: blog.description }} />
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
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  formats={formats}
                  placeholder="Enter description"
                />
              </Form.Group>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files ? e.target.files[0] : null)} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formImageWidth">
                <Form.Label>Image Width (px or %)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., 300px or 100%"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formImageHeight">
                <Form.Label>Image Height (px or %)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., 200px or auto"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(e.target.value)}
                />
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
              <ReactQuill
                theme="snow"
                value={editDescription}
                onChange={setEditDescription}
                modules={modules}
                formats={formats}
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group controlId="editFormFile" className="mb-3">
              <Form.Label>Change Image (optional)</Form.Label>
              <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditImage(e.target.files ? e.target.files[0] : null)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editFormImageWidth">
              <Form.Label>Image Width (px or %)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 300px or 100%"
                value={editImageWidth}
                onChange={(e) => setEditImageWidth(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editFormImageHeight">
              <Form.Label>Image Height (px or %)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 200px or auto"
                value={editImageHeight}
                onChange={(e) => setEditImageHeight(e.target.value)}
              />
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
