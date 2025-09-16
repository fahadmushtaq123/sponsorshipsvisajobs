'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useContext } from 'react';
import { ToolContext } from '../../context/ToolContext';
import { AuthContext } from '../../context/AuthContext';
import Link from 'next/link';
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
          style={{ display: 'block' }}
          data-ad-format="fluid"
          data-ad-layout-key="-gw-3+1f-3d+2z"
          data-ad-client="ca-pub-6708928200370482"
          data-ad-slot="5102444283"></ins>
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
};


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
            {tools.flatMap((tool, index) => {
              const toolCard = (
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
                    {tool.title === 'Typing Speed Test' && (
                      <Link href={`/tools/typing-speed-test`} passHref>
                        <Button variant="primary" className="me-2">Use Tool</Button>
                      </Link>
                    )}
                    {isAdmin && (
                      <Button variant="danger" onClick={() => deleteTool(tool.id)}>Delete</Button>
                    )}
                  </Card.Body>
                </Card>
              );

              if (index === 1 || index === 3 || index === 5) {
                return [toolCard, <AdComponent key={`ad-${index}`} />];
              }

              return [toolCard];
            })}
          </Col>
        </Row>
      </Container>
    </main>
  );
}