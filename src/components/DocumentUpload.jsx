import { useRef, useState } from "react";
import { toast } from 'sonner';
export default function DocumentUpload() {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    await fetch("http://13.221.181.223:8000/upload-document", {
      method: "POST",
      body: formData,
    });
    toast.success("Document processed and lead created!");
  };

  return (
    <div
      className={`bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-all text-center border-2 border-dashed text-gray-800 dark:text-gray-100 ${
        dragOver ? "border-primary bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileRef.current.click()}
    >
      <input
        type="file"
        hidden
        ref={fileRef}
        accept=".pdf,.png,.jpg"
        onChange={async (e) => {
          const file = e.target.files[0];
          const formData = new FormData();
          formData.append("file", file);
          await fetch("http://13.221.181.223:8000/upload-document", {
            method: "POST",
            body: formData,
          });
          toast.success("Document processed!");
        }}
      />
      <p className="text-lg text-gray-600">📄 Drag & drop a document here or click to upload</p>
      <p className="text-sm text-gray-400 mt-1">Only single-page PDF or PNG/JPG files supported.</p>
    </div>
  );
}
