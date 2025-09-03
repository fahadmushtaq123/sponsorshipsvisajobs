'use client';

import { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRCodeGenerator() {
  const [inputText, setInputText] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const generateQRCode = () => {
    setQrValue(inputText);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <main>
      <Container className="mt-5">
        <h1 className="text-center mb-4">QR Code Generator</h1>

        <Card as="section" className="mb-4">
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Enter text or URL to generate QR Code:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={inputText}
                onChange={handleInputChange}
                placeholder="e.g., Hello World! or https://www.example.com"
                aria-label="Text or URL for QR code generation"
              />
            </Form.Group>

            <Button variant="primary" onClick={generateQRCode} className="mb-3">
              Generate QR Code
            </Button>

            {qrValue && (
              <div className="text-center mt-4">
                <QRCodeCanvas
                  id="qrcode-canvas"
                  value={qrValue}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
                <p className="mt-2">Scan this QR Code</p>
                <Button variant="success" onClick={downloadQRCode} className="mt-3">
                  Download QR Code
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}
