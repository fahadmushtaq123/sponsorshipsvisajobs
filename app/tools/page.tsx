
'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useContext } from 'react';
import { ToolContext } from '../../context/ToolContext';
import { AuthContext } from '../../context/AuthContext';
import Link from 'next/link';

export default function Tools() {
  const toolContext = useContext(ToolContext);
  const authContext = useContext(AuthContext);

  if (!toolContext || !authContext) {
    return <div>Loading...</div>;
  }

  const { tools, deleteTool } = toolContext;
  const { isAdmin } = authContext;

  return (
    <main>
      <Container className="mt-5">
        <h1 className="text-center mb-4">Tools</h1>
        <Row>
          <Col>
            <h2>Available Tools</h2>
            {tools.map((tool) => (
              <Card as="article" key={tool.id} className="mb-3">
                
                <Card.Body>
                  <Card.Title>{tool.title}</Card.Title>
                  <Card.Text>{tool.description}</Card.Text>
                  {tool.title === 'Image Resizer' && (
                    <Link href={`/tools/image-resizer`} passHref>
                      <Button variant="primary" className="me-2">Use Tool</Button>
                    </Link>
                  )}
                  {tool.title === 'Merge PDF' && (
                    <Link href={`/tools/merge-pdf`} passHref>
                      <Button variant="primary" className="me-2">Use Tool</Button>
                    </Link>
                  )}
                  {tool.title === 'PDF Editor' && (
                    <Link href={`/tools/pdf-editor`} passHref>
                      <Button variant="primary" className="me-2">Use Tool</Button>
                    </Link>
                  )}
                  {tool.title === 'Resume Scoring' && (
                    <Link href={`/tools/resume-scoring`} passHref>
                      <Button variant="primary" className="me-2">Use Tool</Button>
                    </Link>
                  )}
                  {tool.title === 'Text Utility' && (
                    <Link href={`/tools/text-utility`} passHref>
                      <Button variant="primary" className="me-2">Use Tool</Button>
                    </Link>
                  )}
                  {tool.title === 'Unit Converter' && (
                    <Link href={`/tools/unit-converter`} passHref>
                      <Button variant="primary" className="me-2">Use Tool</Button>
                    </Link>
                  )}
                  {tool.title === 'QR Code Generator' && (
                    <Link href={`/tools/qr-code-generator`} passHref>
                      <Button variant="primary" className="me-2">Use Tool</Button>
                    </Link>
                  )}
                  
                  
                  {isAdmin && (
                    <Button variant="danger" onClick={() => deleteTool(tool.id)}>Delete</Button>
                  )}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
