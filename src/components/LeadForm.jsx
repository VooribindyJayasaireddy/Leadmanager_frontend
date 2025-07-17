import { useState } from "react";
import { toast } from 'sonner';

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    await fetch("http://13.221.181.223:8000/create-lead", {
      method: "POST",
      body: formData,
    });
    toast.success("Lead created!");
    setForm({ name: "", email: "", phone: "" });
  };

  return (
    <div className="bg-glass-gradient backdrop-blur-md border border-white/10 rounded-xl p-4 text-gray-800 dark:text-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-primary">Manual Lead Entry</h2>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {["name", "email", "phone"].map((field) => (
          field === "phone" ? (
            <input
              key={field}
              type="tel"
              required
              pattern="\d{10,15}"
              maxLength={15}
              minLength={10}
              placeholder="Phone"
              className="border rounded-md p-2"
              value={form.phone}
              onChange={(e) => {
                // Only allow digits
                const val = e.target.value.replace(/[^\d]/g, "");
                setForm({ ...form, phone: val });
              }}
            />
          ) : (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              required
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border rounded-md p-2"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          )
        ))}
        <button
          type="submit"
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
        >
          Add Lead
        </button>
      </form>
    </div>
  );
}
