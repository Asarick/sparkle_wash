document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const receipt = document.getElementById('receipt');
    const receiptContent = document.getElementById('receiptContent');
    const printButton = document.getElementById('printButton');
    const loadingSpinner = document.getElementById('loadingSpinner');

    function validateForm() {
        let inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });
        return isValid;
    }

    function generateTicketNumber() {
        return 'SW' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    function calculateTotalPrice() {
        const packagePrices = {
            'Basic Wash': 1599,
            'Deluxe Wash': 2499,
            'Premium Wash': 3999
        };
        const additionalServicePrices = {
            'Underwash': 1299,
            'Interior Wash': 1999,
            'Vacuuming': 599,
            'Engine Wash': 2999
        };

        let totalPrice = packagePrices[document.getElementById('package').value] || 0;

        document.querySelectorAll('input[type="checkbox"]:checked').forEach(function (checkbox) {
            totalPrice += additionalServicePrices[checkbox.value] || 0;
        });

        return totalPrice;
    }

    function createReceiptHTML(ticketNumber) {
        const totalPrice = calculateTotalPrice();
        const additionalServices = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        return `
            <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
            <p><strong>Name:</strong> ${document.getElementById('name').value}</p>
            <p><strong>Phone:</strong> ${document.getElementById('phone').value}</p>
            <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
            <p><strong>Date:</strong> ${document.getElementById('date').value}</p>
            <p><strong>Time:</strong> ${document.getElementById('time').value}</p>
            <p><strong>Vehicle Details:</strong></p>
            <ul>
                <li>Number Plate: ${document.getElementById('numberplate').value}</li>
                <li>Make: ${document.getElementById('make').value}</li>
                <li>Model: ${document.getElementById('model').value}</li>
                <li>Color: ${document.getElementById('color').value}</li>
                <li>Type: ${document.getElementById('vehicleType').value}</li>
            </ul>
            <p><strong>Wash Package:</strong> ${document.getElementById('package').value}</p>
            <p><strong>Additional Services:</strong> ${additionalServices.join(', ') || 'None'}</p>
            <p><strong>Total Price:</strong> Kes ${totalPrice}</p>
        `;
    }

    function storeAppointment(ticketNumber) {
        const appointment = {
            id: ticketNumber,
            customer: document.getElementById('name').value,
            service: document.getElementById('package').value,
            date: document.getElementById('date').value,
            status: 'Pending'
        };

        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please fill in all required fields.');
            return;
        }

        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
        }

        const ticketNumber = generateTicketNumber();
        const receiptHTML = createReceiptHTML(ticketNumber);
        
        receiptContent.innerHTML = receiptHTML;
        receipt.style.display = 'block';
        printButton.style.display = 'block';
        
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }

        storeAppointment(ticketNumber);

        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();
        
        this.reset();
    });

    printButton.addEventListener('click', function() {
        window.print();
    });
});