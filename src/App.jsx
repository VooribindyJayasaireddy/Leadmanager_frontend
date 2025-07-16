import Header from "./components/Header";
import LeadForm from "./components/LeadForm";
import DocumentUpload from "./components/DocumentUpload";
import LeadTable from "./components/LeadTable";
import InteractModal from "./components/InteractModal";
import WorkflowDesigner from "./components/WorkflowDesigner";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/30 via-white to-green-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      <Header />

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Manual Form */}
        <LeadForm />

        {/* Document Upload */}
        <DocumentUpload />

        {/* Table and Modal */}
        <div className="md:col-span-2">
          <LeadTable />
        </div>

        {/* Workflow Designer */}
        <div className="md:col-span-2">
          <WorkflowDesigner />
        </div>
      </main>

      {/* Interact modal will be conditionally shown */}
      <InteractModal />
    </div>
  );
}
