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
            width={220}
            height={90}