'use client';

import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

export default function TextUtility() {
  const [inputText, setInputText] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [sentenceCount, setSentenceCount] = useState<number>(0);
  const [paragraphCount, setParagraphCount] = useState<number>(0);

  useEffect(() => {
    // Word Count
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    // Character Count
    setCharCount(inputText.length);

    // Sentence Count (simple approach: count periods, exclamation marks, question marks)
    const sentences = inputText.split(/[.!?]+\s*/).filter(Boolean);
    setSentenceCount(sentences.length);

    // Paragraph Count (simple approach: count double newlines)
    const paragraphs = inputText.split(/\n\s*\n/).filter(Boolean);
    setParagraphCount(paragraphs.length);

  }, [inputText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const toUpperCase = () => {
    setInputText(inputText.toUpperCase());
  };

  const toLowerCase = () => {
    setInputText(inputText.toLowerCase());
  };

  const toCapitalize = () => {
    setInputText(inputText.toLowerCase().replace(/(?:^|\s|\S)[^\s]*/g, function(char) {
      return char.charAt(0).toUpperCase() + char.substr(1);
    }));
  };

  const removeExtraSpaces = () => {
    setInputText(inputText.replace(/\s+/g, ' ').trim());
  };

  const clearText = () => {
    setInputText('');
  };

  return (
    <main>
      <Container className="mt-5">
        <h1 className="text-center mb-4">Text Utility</h1>

        <Form.Group className="mb-3">
          <Form.Label>Enter your text here:</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type or paste your text..."
            aria-label="Text input for analysis and transformation"
          />
        </Form.Group>

        <Row className="mb-4">
          <Col>
            <Button variant="primary" onClick={toUpperCase} className="me-2 mb-2">UPPERCASE</Button>
            <Button variant="primary" onClick={toLowerCase} className="me-2 mb-2">lowercase</Button>
            <Button variant="primary" onClick={toCapitalize} className="me-2 mb-2">Capitalize Each Word</Button>
            <Button variant="secondary" onClick={removeExtraSpaces} className="me-2 mb-2">Remove Extra Spaces</Button>
            <Button variant="danger" onClick={clearText} className="mb-2">Clear Text</Button>
          </Col>
        </Row>

        <Card as="section" className="mb-3">
          <Card.Body>
            <Card.Title>Text Analysis</Card.Title>
            <Row>
              <Col>Word Count: <strong>{wordCount}</strong></Col>
              <Col>Character Count: <strong>{charCount}</strong></Col>
            </Row>
            <Row>
              <Col>Sentence Count: <strong>{sentenceCount}</strong></Col>
              <Col>Paragraph Count: <strong>{paragraphCount}</strong></Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}
