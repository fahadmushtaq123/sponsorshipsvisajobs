'use client';

import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; // Or a loading indicator
  }

  const { isAdmin, logout } = authContext;

  return (
    <Navbar bg="light" variant="light" expand="lg" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand href="/">
          <Image
            src="/compressed/logo2.png"
            alt="Jobs Board Logo"
            width={240}
            height={80}
            priority
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="nav-link-custom" href="/">All Jobs</Nav.Link>
            <Nav.Link className="nav-link-custom" href="/pakistan-jobs">Pakistan Jobs</Nav.Link>
            <Nav.Link className="nav-link-custom" href="/job-categories">Job Categories</Nav.Link>
            <Nav.Link className="nav-link-custom" href="/government-jobs">Government Jobs</Nav.Link>
            <Nav.Link className="nav-link-custom" href="/sponsorship-jobs">Sponsorship Visa Jobs</Nav.Link>
            <Nav.Link className="nav-link-custom" href="/scholarships">Scholarships Foreign Universities</Nav.Link>
            <Nav.Link className="nav-link-custom" href="/blogs">Blogs</Nav.Link>
            <Nav.Link className="nav-link-custom" href="/tools">Tools</Nav.Link>
            
            <Nav.Link className="nav-link-custom" href="/games">Games</Nav.Link>
          </Nav>
          {isAdmin ? (
            <NavDropdown title="Admin" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} href="/admin/dashboard">Admin Panel</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Link href="/admin" passHref>
              <Button variant="outline-dark">Login</Button>
            </Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}