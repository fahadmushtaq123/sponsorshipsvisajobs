
'use client';

import { Container, Row, Col, Nav } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <Container>
        <Row>
          <Col>
            <Nav className="justify-content-center">
              <Nav.Link href="/contact-us" className="text-white">Contact Us</Nav.Link>
              <Nav.Link href="/about-us" className="text-white">About Us</Nav.Link>
              <Nav.Link href="/privacy-policy" className="text-white">Privacy Policy</Nav.Link>
              <Nav.Link href="/terms-and-conditions" className="text-white">Terms and Conditions</Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
