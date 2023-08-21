const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3045;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Load initial data from JSON file if available
let payments = [];
const dataFilePath = 'data.json';
if (fs.existsSync(dataFilePath)) {
    const rawData = fs.readFileSync(dataFilePath);
    payments = JSON.parse(rawData);
}

app.get('/payments', (req, res) => {
    res.json(payments);
});

app.post('/add-payment', (req, res) => {
    const newPayment = req.body;
    payments.push(newPayment);
    savePaymentsToFile();
    res.status(201).json({ message: 'Payment added successfully.' });
});

// implement delete by rent date 
app.delete('/delete-payment/:rentDate', (req, res) => {
    const rentDate = req.params.rentDate;
    payments = payments.filter((payment) => payment.rentDate !== rentDate);
    savePaymentsToFile();
    res.status(200).json({ message: 'Payment deleted successfully.' });
});

app.put('/edit-payment/:rentDate', (req, res) => {
    const rentDate = req.params.rentDate;
    const { paymentDate, paid, note } = req.body; // Updated parameter name
    // Find and update the payment with the matching rentDate
    payments.forEach(payment => {
        if (payment.rentDate === rentDate) {
            payment.paymentDate = paymentDate; // Updated property name
            payment.paid = paid;
            payment.note = note;
        }
    });
    savePaymentsToFile();
    res.status(200).json({ message: 'Payment edited successfully.' });
});


function savePaymentsToFile() {
    fs.writeFileSync(dataFilePath, JSON.stringify(payments, null, 2));
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
