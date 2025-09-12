'use client';

import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function MergePdf() {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleMerge = async () => {
    if (!files || files.length === 0) {
      alert('Please select at least one PDF file.');
      return;
    }

    try {
      const mergedPdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const pdfBytes = await files[i].arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedPdfBytes = await mergedPdf.save();

      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('An error occurred while merging the PDFs. Please check the console for more details.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Merge PDF</h1>
      <Row>
        <Col md={6} className="mx-auto">
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label>Select PDF Files</Form.Label>
                  <Form.Control type="file" multiple onChange={handleFileChange} accept=".pdf" />
                </Form.Group>

                <Button variant="primary" onClick={handleMerge} disabled={!files || files.length === 0}>
                  Merge PDFs
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
