import { useEffect, useState } from "react";
import { toast } from 'sonner';

export default function LeadTable() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchLeads = async () => {
    const res = await fetch("http://localhost:8000/leads");
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (email) => {
    await fetch("http://localhost:8000/update-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, status: "Contacted" }),
    });
    toast.success("Status updated!");
    fetchLeads();
  };

  const deleteLead = async (email) => {
    await fetch("http://localhost:8000/delete-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    toast.error("Lead deleted!");
    fetchLeads();
  };

  const filtered = leads.filter((lead) =>
    filter === "All" ? true : lead.status === filter
  );

  // Export helper
  const downloadFile = async (type) => {
    const url =
      type === "csv"
        ? "http://localhost:8000/export-csv"
        : "http://localhost:8000/export-excel";

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");

      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `leads.${type === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success(`Exported ${type.toUpperCase()} successfully`);
    } catch (err) {
      toast.error(`Failed to export ${type.toUpperCase()}`);
      console.error(err);
    }
  };

  return (
    <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-all text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">📋 Lead Dashboard</h2>
        <div className="space-x-2">
          {['All', 'New', 'Contacted'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === tab
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => downloadFile("csv")}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md"
        >
          📄 Export CSV
        </button>
        <button
          onClick={() => downloadFile("excel")}
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md"
        >
          📊 Export Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-primary/10 text-primary dark:bg-gray-800 dark:text-blue-200">
              <th className="px-4 py-2 rounded-tl-xl">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Source</th>
              <th className="px-4 py-2 rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.email} className="border-b hover:bg-gray-50">
                <td className="p-2">{lead.name}</td>
                <td className="p-2">{lead.email}</td>
                <td className="p-2">{lead.phone}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      lead.status === "New"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="p-2">{lead.source}</td>
                <td className="p-2 text-right space-x-2">
                  {lead.status === "New" && (
                    <button
                      onClick={() => updateStatus(lead.email)}
                      className="bg-accent text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Mark Contacted
                    </button>
                  )}
                  <button
                    onClick={() => deleteLead(lead.email)}
                    className="bg-danger text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("open-interact", {
                          detail: lead,
                        })
                      )
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    Interact
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-4">No leads to show.</p>
        )}
      </div>
    </div>
  );
}
