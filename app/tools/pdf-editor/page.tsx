

'use client';

import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

export default function PdfEditor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [modifiedPdfBytes, setModifiedPdfBytes] = useState<Uint8Array | null>(null);
  const [textToAdd, setTextToAdd] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
      setModifiedPdfBytes(null);
    }
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleAddText = async () => {
    if (!pdfFile) {
      alert('Please upload a PDF first.');
      return;
    }

    try {
      const existingPdfBytes = modifiedPdfBytes || await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      if (pageNumber > pages.length || pageNumber < 1) {
        alert(`Page number out of range. This PDF has ${pages.length} pages.`);
        return;
      }

      const page = pages[pageNumber - 1];
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText(textToAdd, {
        x: 50,
        y: page.getHeight() - 50,
        font,
        size: 24,
        color: rgb(0, 0, 0),
      });

      const newModifiedPdfBytes = await pdfDoc.save();
      setModifiedPdfBytes(newModifiedPdfBytes);
    } catch (error) {
      console.error('Error adding text to PDF:', error);
      alert('Failed to add text to PDF. Please check the console for details.');
    }
  };

  const handleAddImage = async () => {
    if (!pdfFile || !imageFile) {
      alert('Please upload both PDF and image files first.');
      return;
    }

    try {
      const existingPdfBytes = modifiedPdfBytes || await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      if (pageNumber > pages.length || pageNumber < 1) {
        alert(`Page number out of range. This PDF has ${pages.length} pages.`);
        return;
      }

      const page = pages[pageNumber - 1];
      const imageBytes = await imageFile.arrayBuffer();
      let pdfImage;

      if (imageFile.type === 'image/jpeg') {
        pdfImage = await pdfDoc.embedJpg(imageBytes);
      } else if (imageFile.type === 'image/png') {
        pdfImage = await pdfDoc.embedPng(imageBytes);
      } else {
        alert('Unsupported image format. Please use JPEG or PNG.');
        return;
      }

      page.drawImage(pdfImage, {
        x: 50,
        y: page.getHeight() - 200,
        width: 150,
        height: 150,
      });

      const newModifiedPdfBytes = await pdfDoc.save();
      setModifiedPdfBytes(newModifiedPdfBytes);
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      alert('Failed to add image to PDF. Please check the console for details.');
    }
  };

  const handleDownload = () => {
    if (modifiedPdfBytes) {
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `modified_${pdfFile?.name || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert('No modified PDF to download.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">PDF Editor</h1>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="pdfFile" className="mb-3">
                  <Form.Label>Upload PDF</Form.Label>
                  <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
                </Form.Group>

                {pdfFile && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Text to Add</Form.Label>
                      <Form.Control
                        type="text"
                        value={textToAdd}
                        onChange={(e) => setTextToAdd(e.target.value)}
                        placeholder="Enter text to add to PDF"
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={handleAddText} className="me-2">
                      Add Text to PDF
                    </Button>

                    <Form.Group controlId="imageFile" className="mb-3 mt-3">
                      <Form.Label>Upload Image</Form.Label>
                      <Form.Control type="file" accept=".jpeg,.jpg,.png" onChange={handleImageFileChange} />
                    </Form.Group>
                    <Button variant="primary" onClick={handleAddImage} className="me-2">
                      Add Image to PDF
                    </Button>

                    <Form.Group className="mb-3 mt-3">
                      <Form.Label>Page Number (for text/image)</Form.Label>
                      <Form.Control
                        type="number"
                        value={pageNumber}
                        onChange={(e) => setPageNumber(Number(e.target.value))}
                        min={1}
                      />
                    </Form.Group>

                    {modifiedPdfBytes && (
                      <Button variant="success" onClick={handleDownload} className="mt-3">
                        Download Modified PDF
                      </Button>
                    )}
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

