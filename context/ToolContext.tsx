
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

interface Tool {
  id: number;
  title: string;
  description: string;
  
}

interface ToolContextType {
  tools: Tool[];
  addTool: (tool: Omit<Tool, 'id'>) => void;
  deleteTool: (id: number) => void;
}

export const ToolContext = createContext<ToolContextType | undefined>(undefined);

const defaultInitialTools: Tool[] = [
  {
    id: 1,
    title: 'Image Resizer',
    description: 'Reduce images is a free online image resizer that allows you to resize an image, change their format, compress them, and save the resized images as JPG, PNG or ...',
  },
  {
    id: 2,
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into a single PDF document.',
  },
  {
    id: 3,
    title: 'PDF Editor',
    description: 'Edit PDF documents by adding text, images, and more.',
  },
  {
    id: 4,
    title: 'Text Utility',
    description: 'Perform various text operations like case conversion, word count, and more.',
  },
  {
    id: 5,
    title: 'Unit Converter',
    description: 'Convert between different units of measurement.',
  },
  {
    id: 6,
    title: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs.',
  }
];

export const ToolProvider = ({ children }: { children: ReactNode }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedTools = localStorage.getItem('tools');
      if (savedTools) {
        try {
          const parsedTools = JSON.parse(savedTools);
          if (parsedTools.length !== defaultInitialTools.length) {
            setTools(defaultInitialTools);
          } else {
            setTools(parsedTools);
          }
        } catch (e) {
          console.error("Error parsing saved tools, resetting to default", e);
          setTools(defaultInitialTools);
        }
      } else {
        setTools(defaultInitialTools);
      }
    } catch (error) {
      console.error('Error loading tools from localStorage', error);
      setTools(defaultInitialTools);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('tools', JSON.stringify(tools));
      } catch (error) {
        console.error('Error saving tools to localStorage', error);
      }
    }
  }, [tools, isLoaded]);

  const addTool = (tool: Omit<Tool, 'id'>) => {
    const newTool = { ...tool, id: tools.length > 0 ? Math.max(...tools.map(t => t.id)) + 1 : 1 };
    setTools(prevTools => [newTool, ...prevTools]);
  };

  const deleteTool = (id: number) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  return (
    <ToolContext.Provider value={{ tools, addTool, deleteTool }}>
      {children}
    </ToolContext.Provider>
  );
};
