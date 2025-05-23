import { useState } from "react";
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  NodeViewWrapper,
  BubbleMenu,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import Underline from "@tiptap/extension-underline"; // 

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  Quote,
  CheckSquare,
  List,
  ListOrdered,
  Code,
  Minus,Table
} from "lucide-react";

// Initialize syntax highlighting
const lowlight = createLowlight();
lowlight.register("javascript", js);
lowlight.register("python", python);
lowlight.register("html", html);
lowlight.register("css", css);

// Custom Code Block Component with Dropdown
const CodeBlockComponent = ({ node, updateAttributes }) => {
  const [language, setLanguage] = useState(node.attrs.language || "javascript");

  const handleChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    updateAttributes({ language: newLanguage });
  };

  return (
    <NodeViewWrapper className="relative font-rethink-sans border rounded-lg p-3 bg-gray-900 text-white text-lg">
      {/* Language Dropdown */}
      <select
        className="absolute top-2 right-2 cursor-pointer bg-gray-700 text-white text-lg p-1 rounded"
        value={language}
        onChange={handleChange}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>

      {/* Code Content */}
      <NodeViewContent as="pre" className="p-3 font-rethink-sans text-lg overflow-x-auto" />
    </NodeViewWrapper>
  );
};

const Editor = ({ file, onUpdateContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false ,underline:true}),
      Underline,
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    content: file?.content || "", // Load content from file
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML(); // Get latest content
      onUpdateContent(file.id, { 
        title: file.title,
        content: updatedContent, 
        
      });
       // Send update
    },
  });

  if (!editor) return null;

  return (
    <div className="font-rethink-sans border prose w-full max-w-none mx-auto   rounded-lg shadow-md bg-white p-6 h-full overflow-y-auto">
      {/* Notion-Style Floating Menu (VERTICAL) */}
      {editor && (
        <FloatingMenu
        editor={editor}
        tippyOptions={{
          duration: 100,
          placement: "bottom-start",
          offset: [0, 10],
        }}
      >
        <div className="bg-black text-white text-lg shadow-lg p-3 rounded-lg flex flex-col gap-1 max-h-[400px] overflow-y-auto w-96">
  {/* Headings */}
  <h3 className="text-gray-400 text-xs px-2 font-semibold">Headings</h3>
  <button
    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Heading1 size={16} /> Heading 1
  </button>
  <button
    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Heading2 size={16} /> Heading 2
  </button>
  <button
    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Heading3 size={16} /> Heading 3
  </button>

  {/* Text Formatting */}
  <h3 className="text-gray-400 text-xs px-2 font-semibold mt-2">Text Formatting</h3>
  <button
    onClick={() => editor.chain().focus().setParagraph().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    Text
  </button>
  <button
    onClick={() => editor.chain().focus().toggleBold().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Bold size={16} /> Bold
  </button>
  <button
    onClick={() => editor.chain().focus().toggleItalic().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Italic size={16} /> Italic
  </button>
  <button
    onClick={() => editor.chain().focus().toggleUnderline().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <UnderlineIcon size={16} /> Underline
  </button>
  <button
    onClick={() => editor.chain().focus().toggleStrike().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Strikethrough size={16} /> Strikethrough
  </button>

  {/* Lists */}
  <h3 className="text-gray-400 text-xs px-2 font-semibold mt-2">Lists</h3>
  <button
    onClick={() => editor.chain().focus().toggleBulletList().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <List size={16} /> Bulleted List
  </button>
  <button
    onClick={() => editor.chain().focus().toggleOrderedList().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <ListOrdered size={16} /> Numbered List
  </button>
  <button
    onClick={() => editor.chain().focus().toggleTaskList().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <CheckSquare size={16} /> Task List
  </button>

  {/* Blocks */}
  <h3 className="text-gray-400 text-xs px-2 font-semibold mt-2">Blocks</h3>
  <button
    onClick={() => editor.chain().focus().toggleBlockquote().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Quote size={16} /> Blockquote
  </button>
  <button
    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Code size={16} /> Code Block
  </button>
  <button
    onClick={() => editor.chain().focus().setHorizontalRule().run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Minus size={16} /> Horizontal Rule
  </button>

  {/* Tables */}
  <h3 className="text-gray-400 text-xs px-2 font-semibold mt-2">Tables</h3>
  <button
    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
  >
    <Table size={16} /> Insert Table
  </button>
</div>
      </FloatingMenu>
      
      )}

      {/* Bubble Menu (Shows on Text Selection) */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bg-black text-white p-3 rounded-lg flex gap-3 shadow-lg">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className="p-2 hover:bg-gray-700 rounded">
              <Bold size={20} />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className="p-2 hover:bg-gray-700 rounded">
              <Italic size={20} />
            </button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="p-2 hover:bg-gray-700 rounded">
              <UnderlineIcon size={20} />
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Main Editor */}
      <EditorContent editor={editor} className="prose max-w-none p-4 outline-none text-2xl" />
    </div>
  );
};

export default Editor;
