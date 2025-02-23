import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ExtractedElement {
  id: string;
  name: string;
}

interface FileContextType {
  bpmnFileContent: string | null;
  csvFileContent: string | null;
  extractedElements: ExtractedElement[];
  setBpmnFileContent: (content: string | null) => void;
  setCsvFileContent: (content: string | null) => void;
  setExtractedElements: (elements: ExtractedElement[]) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [bpmnFileContent, setBpmnFileContent] = useState<string | null>(null);
  const [csvFileContent, setCsvFileContent] = useState<string | null>(null);
  const [extractedElements, setExtractedElements] = useState<ExtractedElement[]>([]);

  return (
    <FileContext.Provider
      value={{
        bpmnFileContent,
        csvFileContent,
        extractedElements,
        setBpmnFileContent,
        setCsvFileContent,
        setExtractedElements,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};

