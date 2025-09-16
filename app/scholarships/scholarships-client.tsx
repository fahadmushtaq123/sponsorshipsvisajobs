'use client';

import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { ScholarshipContext } from '../../context/ScholarshipContext';
import { AuthContext } from '../../context/AuthContext';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const AdComponent = () => {
  return (
    <div className="my-3">
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6708928200370482"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-6708928200370482"
          data-ad-slot="6441282979"></ins>
      <Script
        id="adsbygoogle-init-scholarships"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
};

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

export default function ScholarshipsClient() {
  const scholarshipContext = useContext(ScholarshipContext);
  const authContext = useContext(AuthContext);
  const [copied, setCopied] = useState(false);

  if (!scholarshipContext || !authContext) {
    return <div>Loading...</div>;
  }

  const { scholarships, addScholarship, deleteScholarship } = scholarshipContext;
  const { isAdmin } = authContext;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addScholarship({
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

  const handleShare = async (scholarship: any) => {
    const shareData = {
      title: scholarship.title,
      text: `Check out this scholarship: ${scholarship.title}`,
      url: `${window.location.href}#scholarship-${scholarship.id}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Scholarships Foreign Universities</h1>
      <Row>
        <Col md={isAdmin ? 8 : 12}>
          <h2>Available Scholarships for Foreign Universities</h2>
          {scholarships.flatMap((scholarship, index) => {
            const scholarshipCard = (
              <Card key={scholarship.id} id={`scholarship-${scholarship.id}`} className="mb-3">
                <Card.Img variant="top" src={scholarship.image} />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title>{scholarship.title}</Card.Title>
                    <Button variant="outline-primary" onClick={() => handleShare(scholarship)}>
                      {copied ? 'Copied!' : 'Share'}
                    </Button>
                  </div>
                  <Card.Text as="div" dangerouslySetInnerHTML={{ __html: scholarship.description }} />
                  {isAdmin && (
                    <Button variant="danger" onClick={() => deleteScholarship(scholarship.id)}>Delete</Button>
                  )}
                </Card.Body>
              </Card>
            );

            return [scholarshipCard, <AdComponent key={`ad-${index}`} />];
          })}
        </Col>
        {isAdmin && (
          <Col md={4}>
            <h2>Post a Scholarship for Foreign Universities</h2>
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

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        )}
      </Row>
    </Container>
  );
}
