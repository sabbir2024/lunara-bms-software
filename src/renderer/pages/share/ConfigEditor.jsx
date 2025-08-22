import { useState, useEffect } from "react";

const ConfigEditor = () => {
    const [config, setConfig] = useState({});
    const [status, setStatus] = useState("");

    // Load config from backend
    useEffect(() => {
        fetch("http://localhost:3001/api/v1/config")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setConfig(data.data);
            })
            .catch(() => setStatus("❌ Failed to fetch config"));
    }, []);

    const handleChange = (key, value) => {
        setConfig((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = () => {
        fetch("http://localhost:3001/api/v1/config", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setStatus("✅ Config Updated Successfully!");
                else setStatus("❌ Update Failed");
            })
            .catch(() => setStatus("❌ Network Error"));
    };

    return (
        <div className="max-w-md mx-auto  bg-white rounded shadow-md">
            <h2 className="text-md font-bold mb-4">Config Editor</h2>

            {Object.entries(config).map(([key, value]) => (
                <div key={key} className="mb-4">
                    <input
                        type="text"
                        className="mt-1 p-2 w-full border rounded bg-gray-50"
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                    />
                </div>
            ))}

            <div className="text-right">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    💾 Save Config
                </button>
            </div>

            {status && (
                <div className="mt-4 text-center text-green-600 font-semibold">
                    {status}
                </div>
            )}
        </div>
    );
};

export default ConfigEditor;
