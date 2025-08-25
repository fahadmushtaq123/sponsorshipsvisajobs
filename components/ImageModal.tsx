
'use client';

import { Modal } from 'react-bootstrap';
import Image from 'next/image';

interface ImageModalProps {
  show: boolean;
  onHide: () => void;
  imageUrl: string;
}

export default function ImageModal({ show, onHide, imageUrl }: ImageModalProps) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Job Advertisement</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Image 
          src={imageUrl}
          alt="Job Advertisement"
          layout="responsive"
          width={700}
          height={500}
          objectFit="contain"
        />
      </Modal.Body>
    </Modal>
  );
}
