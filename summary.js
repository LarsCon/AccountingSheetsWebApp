document.addEventListener("DOMContentLoaded", function() {
    const summaryTable = document.getElementById("summary-table");
    
    // Retrieve saved data from local storage
    let savedData = localStorage.getItem("savedData");
    if (savedData) {
        let parsedData = JSON.parse(savedData);
        // Log all items in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`Key: ${key}, Value: ${value}`);
        }

        // Function to delete a row and its associated object
        function deleteRowAndObject(index) {
            parsedData.sheets.splice(index, 1); // Remove the object from the array
            localStorage.setItem("savedData", JSON.stringify(parsedData)); // Update local storage

            // Remove the corresponding row from the table
            summaryTable.deleteRow(index + 1); // Add 1 to account for the header row
        }

        // Function to handle the "View" button click event
        function handleViewButtonClick(index) {
            const sheet = parsedData.sheets[index];
            localStorage.setItem("currentSheet", JSON.stringify(sheet)); // Store the current sheet in local storage
            window.location.href = "pages/display.html"; // Redirect to display.html
        }

        // Function to handle the "Edit" button click event
        function handleEditButtonClick(index) {
            const sheet = parsedData.sheets[index];
            localStorage.setItem("currentSheetForEdit", JSON.stringify(sheet)); // Store the clicked entry's data in local storage
            window.location.href = "pages/editold.html"; // Redirect to edit.html
        }

        // Function to update the originally selected sheet in savedData
        function updateSavedDataWithSheet(sheet) {
            // Retrieve saved data from local storage
            let savedData = JSON.parse(localStorage.getItem("savedData")) || {}; // Initialize as empty object
            savedData.sheets = savedData.sheets || []; // Initialize sheets array if not present

            // Find the index of the originally selected sheet in savedData
            const index = savedData.sheets.findIndex(savedSheet => savedSheet.title === sheet.title);

            if (index !== -1) {
                // Replace the existing entry with the new data
                savedData.sheets[index] = sheet;

                // Update savedData in local storage
                localStorage.setItem("savedData", JSON.stringify(savedData));
            }
        }

        // Iterate over each saved object and create a row in the table
        parsedData.sheets.forEach((sheet, index) => {
            const title = sheet.title;
            const newRow = summaryTable.insertRow();
            
            // Title cell
            const titleCell = newRow.insertCell(0);
            titleCell.textContent = title;

            // Actions cell
            const actionsCell = newRow.insertCell(1);
            const viewButton = document.createElement("button");
            viewButton.textContent = "View";
            viewButton.classList.add("view-btn");
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edit-btn");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-btn");

            // Add event listener for view button
            viewButton.addEventListener("click", function() {
                handleViewButtonClick(index);
            });

            // Add event listener for edit button
            editButton.addEventListener("click", function() {
                handleEditButtonClick(index);
            });

            // Add event listener for delete button
            deleteButton.addEventListener("click", function() {
                const confirmDelete = confirm("Are you sure you want to delete this entry?");
                if (confirmDelete) {
                    deleteRowAndObject(index);
                }
            });

            actionsCell.appendChild(viewButton);
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    }
});
