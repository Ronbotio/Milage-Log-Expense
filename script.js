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
// --- New Data Calculation Function ---

/**
 * Calculates the total mileage from all logs and updates the table footer.
 */
function calculateMonthlyTotal() {
    const logs = loadLogs();
    let totalMileage = 0;

    logs.forEach(log => {
        // Ensure the mileage property exists and is a number before adding
        if (log.mileage) {
            totalMileage += log.mileage;
        }
    });

    // Update the footer cell with the calculated total
    const totalElement = document.getElementById('monthly-total');
    if (totalElement) {
        // Display the total, rounded to one decimal place
        totalElement.textContent = `Total Mileage Logged: ${totalMileage.toFixed(1)} mi`;
    }
}

// ... the rest of the file ...
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

            // Insert cells (order matters)
            row.insertCell().textContent = formattedDate;
            // *** NEW LINE ***
            row.insertCell().textContent = log.mileage.toFixed(1) + " mi"; 
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
        // *** NEW LINE ***
        mileage: parseFloat(document.getElementById('mileage-amount').value),
        locations: document.getElementById('locations-traveled').value,
        tickets: document.getElementById('servicenow-tickets').value
    };

       const logs = loadLogs();
    logs.push(newLog); // Add the new log
    saveLogs(logs);    // Save the updated list

    renderLogs();      // Update the table view
    calculateMonthlyTotal(); // Calculate the new total
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
        let csvContent = "Date,Mileage (Miles),Locations Traveled,ServiceNow Tickets\n"; 
    
    logs.forEach(log => {
        // Escape quotes and replace newlines in text fields
        const locations = `"${log.locations.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        const tickets = `"${log.tickets.replace(/"/g, '""').replace(/\n/g, ' ')}"`;

        // *** UPDATED DATA ROW ***
        csvContent += `${log.date},${log.mileage.toFixed(1)},${locations},${tickets}\n`;
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
    // ⭐ CALL SPOT 2: ON PAGE LOAD (PLACE IT HERE) ⭐
    calculateMonthlyTotal();

});

