export const metadata = {
  title: 'Handy Tools - Image Resizer, PDF Merger, Text Utility, Unit Converter & More',
  description: 'Explore a collection of useful online tools including an Image Resizer, PDF Merger, Text Utility, Unit Converter, and QR Code Generator to help with your daily tasks.',
};

import Script from 'next/script';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script src="https://fpyf8.com/88/tag.min.js" data-zone="166482" async data-cfasync="false" strategy="beforeInteractive" />
      {children}
    </>
  );
}
