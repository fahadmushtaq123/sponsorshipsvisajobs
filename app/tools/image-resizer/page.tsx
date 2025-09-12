

'use client';

import { Container, Row, Col, Form, Button, Card, ProgressBar } from 'react-bootstrap';
import { useState } from 'react';
import imageCompression from 'browser-image-compression';

export default function ImageResizer() {
  const [image, setImage] = useState<File | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [format, setFormat] = useState('JPG');
  const [quality, setQuality] = useState(80);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleResize = async () => {
    if (!image) {
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: width || height ? Math.max(width, height) : undefined,
      useWebWorker: true,
      fileType: `image/${format.toLowerCase()}`,
      initialQuality: quality / 100,
    };

    try {
      const compressedFile = await imageCompression(image, options);
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(compressedFile);
      downloadLink.download = `resized-${image.name}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error during image compression:', error);
      alert('An error occurred during image compression. Please check the console for more details.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Imagine Resizer</h1>
      <Row>
        <Col md={6} className="mx-auto">
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Select Image</Form.Label>
                  <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formWidth">
                      <Form.Label>Width</Form.Label>
                      <Form.Control type="number" placeholder="Enter width" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formHeight">
                      <Form.Label>Height</Form.Label>
                      <Form.Control type="number" placeholder="Enter height" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formFormat">
                  <Form.Label>Format</Form.Label>
                  <Form.Select value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option>JPG</option>
                    <option>PNG</option>
                    <option>WEBP</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formQuality">
                  <Form.Label>Quality</Form.Label>
                  <ProgressBar now={quality} label={`${quality}%`} />
                  <Form.Range value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} />
                </Form.Group>

                <Button variant="primary" onClick={handleResize} disabled={!image}>
                  Resize Image
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

