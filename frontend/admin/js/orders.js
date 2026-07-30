document.addEventListener('DOMContentLoaded', () => {
    loadOrders();

    document.getElementById('statusFilter').addEventListener('change', (e) => {
        loadOrders(e.target.value);
    });

    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('orderModal').classList.remove('active');
    });
});

let currentOrders = [];
let selectedOrderId = null;

async function loadOrders(status = '') {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Loading...</td></tr>`;

    try {
        currentOrders = await api.admin.orders.list(status || null);
        
        if (currentOrders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No orders found.</td></tr>`;
            return;
        }

        let html = '';
        currentOrders.forEach(order => {
            const date = new Date(order.created_at).toLocaleString();
            html += `
                <tr>
                    <td>#${order.order_id}</td>
                    <td>${date}</td>
                    <td>${order.customer_name}<br><small>${order.customer_phone}</small></td>
                    <td>Rs ${parseFloat(order.total_amount).toLocaleString()}</td>
                    <td><span class="badge ${order.status}">${order.status.toUpperCase()}</span></td>
                    <td>
                        <button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8em;" onclick="openOrderModal(${order.order_id})">View / Update</button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;

    } catch (error) {
        console.error('Failed to load orders', error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Error loading orders.</td></tr>`;
    }
}

function openOrderModal(orderId) {
    const order = currentOrders.find(o => o.order_id === orderId);
    if (!order) return;

    selectedOrderId = orderId;
    
    let itemsHtml = `<ul style="padding-left: 20px; margin-top: 10px; margin-bottom: 20px;">`;
    order.items.forEach(item => {
        itemsHtml += `<li>${item.quantity}x ${item.product.name} @ Rs ${parseFloat(item.price).toLocaleString()}</li>`;
    });
    itemsHtml += `</ul>`;

    const detailsHtml = `
        <p><strong>Order ID:</strong> #${order.order_id}</p>
        <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_phone})</p>
        <p><strong>Address:</strong> ${order.delivery_address}, ${order.delivery_city}</p>
        <p><strong>Payment Method:</strong> ${order.payment_method}</p>
        <p><strong>Delivery Charge:</strong> Rs ${parseFloat(order.delivery_charge).toLocaleString()}</p>
        <p><strong>Total Amount:</strong> Rs ${parseFloat(order.total_amount).toLocaleString()}</p>
        <p><strong>Current Status:</strong> <span class="badge ${order.status}">${order.status.toUpperCase()}</span></p>
        <h4 style="margin-top: 15px;">Items:</h4>
        ${itemsHtml}
    `;

    document.getElementById('orderDetailsContent').innerHTML = detailsHtml;
    document.getElementById('updateStatusSelect').value = order.status;
    document.getElementById('updateMsg').textContent = '';
    document.getElementById('orderModal').classList.add('active');
}

document.getElementById('saveStatusBtn').addEventListener('click', async () => {
    if (!selectedOrderId) return;
    
    const newStatus = document.getElementById('updateStatusSelect').value;
    const btn = document.getElementById('saveStatusBtn');
    const msg = document.getElementById('updateMsg');
    
    btn.textContent = 'Saving...';
    btn.disabled = true;
    msg.textContent = '';
    
    try {
        await api.admin.orders.updateStatus(selectedOrderId, newStatus);
        msg.textContent = 'Status updated successfully!';
        msg.style.color = 'green';
        
        // Refresh list
        loadOrders(document.getElementById('statusFilter').value);
        
        setTimeout(() => {
            document.getElementById('orderModal').classList.remove('active');
        }, 1000);
    } catch (error) {
        console.error('Failed to update status', error);
        msg.textContent = error.detail || 'Failed to update status';
        msg.style.color = 'red';
    } finally {
        btn.textContent = 'Save';
        btn.disabled = false;
    }
});
