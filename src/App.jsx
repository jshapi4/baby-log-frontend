import { useState, useEffect } from "react";
import LogTable from "./LogTable";

function App() {
  const [logs, setLogs] = useState([]);
  const [logInput, setLogInput] = useState("");

  const apiUrl = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

  // Fetch logs from the backend
  useEffect(() => {
    fetch(`${apiUrl}/api/logs`)
      .then((response) => response.json())
      .then((data) => setLogs(data))
      .catch((error) => console.error("Error fetching logs:", error));
  }, [apiUrl]);

  const handleAddLog = () => {
    console.log("attempt to add a log");
    const newLog = { text: logInput };
    fetch(`${apiUrl}/api/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLog),
    })
      .then((response) => response.json())
      .then((data) => {
        setLogs([data, ...logs]);
        setLogInput(""); // Clear the input field after submission
      })
      .catch((error) => console.error("Error adding log:", error));
  };

  const handleArchiveLog = (logId) => {
    if (window.confirm("Are you sure you want to archive this log?")) {
      fetch(`${apiUrl}/api/logs/archive/${logId}`, {
        method: "PUT",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Log archived") {
            setLogs(logs.filter((log) => log._id !== logId)); // Remove from view, but it's still in the database
          }
        })
        .catch((error) => console.error("Error archiving log:", error));
    }
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      fetch(`${apiUrl}/api/logs/${logId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Log deleted") {
            setLogs(logs.filter((log) => log._id !== logId));
          }
        })
        .catch((error) => console.error("Error deleting log:", error));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Baby Logger</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddLog();
        }}
      >
        <input
          type="text"
          value={logInput}
          onChange={(e) => setLogInput(e.target.value)}
          placeholder="Enter log (e.g., Baby woke up)"
        />
        <button type="submit">Add Log</button>
      </form>

      <LogTable
        logs={logs}
        handleArchiveLog={handleArchiveLog}
        handleDeleteLog={handleDeleteLog}
      />

      {/* <table style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Log</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.text}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>
                <button onClick={() => handleArchiveLog(log._id)}>
                  Archive
                </button>
              </td>
              <td>
                <button onClick={() => handleDeleteLog(log._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default App;
