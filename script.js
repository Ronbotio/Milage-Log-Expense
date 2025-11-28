document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mileage-form');
    const expenseTableBody = document.querySelector('#expense-table tbody');
    const exportButton = document.getElementById('export-csv-btn');

    // --- Data Management Functions ---

    /**
     * Loads logs from Local Storage or returns an empty array.
     */
    function loadLogs() {
        const logsJSON = localStorage.getItem('mileageLogs');
        return logsJSON ? JSON.parse(logsJSON) : [];
    }

    /**
     * Saves the array of logs back to Local Storage.
     */
    function saveLogs(logs) {
        localStorage.setItem('mileageLogs', JSON.stringify(logs));
    }

    // --- UI Functions ---

    /**
     * Renders all logs to the table.
     */
    function renderLogs() {
        const logs = loadLogs();
        expenseTableBody.innerHTML = ''; // Clear existing rows

        logs.forEach(log => {
            const row = expenseTableBody.insertRow();
            
            // Format the date for better display
            const formattedDate = new Date(log.date).toLocaleDateString();

            // Insert cells
            row.insertCell().textContent = formattedDate;
            row.insertCell().textContent = log.locations;
            row.insertCell().textContent = log.tickets;
        });
    }

    // --- Event Handlers ---

    // 1. Handle Form Submission
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Stop the default form submission

        // Get values from the form inputs
        const newLog = {
            date: document.getElementById('trip-date').value,
            locations: document.getElementById('locations-traveled').value,
            tickets: document.getElementById('servicenow-tickets').value
        };

        const logs = loadLogs();
        logs.push(newLog); // Add the new log
        saveLogs(logs);    // Save the updated list

        renderLogs();      // Update the table view
        form.reset();      // Clear the form
        alert('Mileage expense logged successfully!');
    });

    // 2. Handle CSV Export
    exportButton.addEventListener('click', () => {
        const logs = loadLogs();
        if (logs.length === 0) {
            alert('No expenses to export!');
            return;
        }

        // Create the CSV content
        let csvContent = "Date,Locations,ServiceNow Tickets\n"; // Header row
        
        logs.forEach(log => {
            // Escape quotes and replace newlines in text fields
            const locations = `"${log.locations.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
            const tickets = `"${log.tickets.replace(/"/g, '""').replace(/\n/g, ' ')}"`;

            csvContent += `${log.date},${locations},${tickets}\n`;
        });

        // Create a blob and a temporary link to download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'mileage_log.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Initial load of logs when the page opens
    renderLogs();
});