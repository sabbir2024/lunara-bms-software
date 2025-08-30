const ExportButtons = ({ onExportPDF, onExportExcel }) => {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={onExportPDF}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
                Export to PDF
            </button>
            <button
                onClick={onExportExcel}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
                Export to Excel
            </button>
        </div>
    );
};

export default ExportButtons;