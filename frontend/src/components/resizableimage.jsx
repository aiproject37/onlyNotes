import { Node, mergeAttributes } from "@tiptap/core";

const ResizableImage = Node.create({
  name: "image",
  group: "block",
  inline: false,
  draggable: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      width: { default: "300px" }, // Default size
    };
  },

  parseHTML() {
    return [{ tag: "img" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes, { class: "resizable-image" })];
  },

  addNodeView() {
    return ({ node, HTMLAttributes, updateAttributes }) => {
      const img = document.createElement("img");
      img.setAttribute("src", node.attrs.src);
      img.setAttribute("alt", node.attrs.alt || "");
      img.style.width = node.attrs.width;
      img.style.maxWidth = "100%"; // Prevents oversized images
      img.style.cursor = "pointer";

      // Make image resizable
      img.addEventListener("dblclick", () => {
        const newWidth = prompt("Enter new width (e.g., 200px, 50%)", node.attrs.width);
        if (newWidth) updateAttributes({ width: newWidth });
      });

      return img;
    };
  },
});

export default ResizableImage;
