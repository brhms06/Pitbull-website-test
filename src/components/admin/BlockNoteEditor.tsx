'use client';

import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { PartialBlock } from '@blocknote/core';

interface Props {
  initialContent?: PartialBlock[];
  onChange: (blocks: PartialBlock[], html: string) => void;
  uploadFile: (file: File) => Promise<string>;
}

/**
 * Thin wrapper around BlockNote, isolated into its own file so it can be
 * loaded via `next/dynamic(..., { ssr: false })` — BlockNote/ProseMirror
 * touches `window` at editor-construction time, which breaks Next's server
 * render even inside a `'use client'` component.
 */
export default function BlockNoteEditor({ initialContent, onChange, uploadFile }: Props) {
  const editor = useCreateBlockNote({
    initialContent: initialContent && initialContent.length > 0 ? initialContent : undefined,
    uploadFile,
  });

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => onChange(editor.document, editor.blocksToFullHTML(editor.document))}
    />
  );
}
