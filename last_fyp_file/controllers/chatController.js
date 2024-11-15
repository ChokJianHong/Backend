const express = require('express');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

async function sendMessage(req, res) {
    const { orderId, message } = req.body;
    const token = req.headers.authorization

    if (!orderId || !message) {
        return res.status(400).json({ error: 'Order ID and message are required' });
    }

    try {
        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        // Retrieve order data from Firestore
        const orderDoc = await admin.firestore().collection('chats').doc(orderId).get();
        if (!orderDoc.exists) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const orderData = orderDoc.data();
        const { customer_id, technician_id, status } = orderData;

        // Check if the user is either the customer or technician on the order and if the status is ongoing
        if ((userId === customer_id || userId === technician_id) && status === 'ongoing') {
            // Add message to Firestore under the chat's messages subcollection
            const messageData = {
                senderId: userId,
                message: message,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            };

            await admin.firestore()
                .collection('chats')
                .doc(orderId)
                .collection('messages')
                .add(messageData);

            return res.status(200).json({ message: 'Message sent successfully' });
        } else {
            return res.status(403).json({ error: 'Unauthorized or order is not ongoing' });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { sendMessage };