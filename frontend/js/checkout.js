document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('checkoutContainer');
    if (container) {
        initCheckout();
    }
});

async function initCheckout() {
    const container = document.getElementById('checkoutContainer');
    
    try {
        const cartItems = await api.cart.get();
        
        if (!cartItems || cartItems.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h3>Your cart is empty</h3>
                    <p style="margin-top: 15px;">You must have items in your cart to checkout.</p>
                    <p style="margin-top: 15px;"><a href="products.html" class="btn btn-primary">Browse Products</a></p>
                </div>
            `;
            return;
        }

        let subtotal = 0;
        let summaryHtml = '';
        
        cartItems.forEach(item => {
            const price = parseFloat(item.product.sale_price || item.product.original_price);
            const lineTotal = price * item.quantity;
            subtotal += lineTotal;
            summaryHtml += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.95em;">
                    <span>${item.product.name} (x${item.quantity})</span>
                    <span>Rs ${lineTotal.toLocaleString()}</span>
                </div>
            `;
        });

        // Simplified layout: Left column form, Right column summary
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px; align-items: start;" id="checkoutGrid">
                
                <!-- Form Column -->
                <div style="background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h3 style="margin-bottom: 20px;">Shipping & Billing Information</h3>
                    <form id="checkoutForm" style="display: grid; gap: 20px;">
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Full Name *</label>
                                <input type="text" id="custName" required style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Phone Number *</label>
                                <input type="text" id="custPhone" required style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                        </div>

                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Email Address (Optional)</label>
                            <input type="email" id="custEmail" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">City *</label>
                                <input type="text" id="custCity" required style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Full Address *</label>
                                <input type="text" id="custAddress" required style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                        </div>

                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Payment Method *</label>
                            <select id="custPayment" required style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="jazzcash">JazzCash</option>
                                <option value="easypaisa">EasyPaisa</option>
                            </select>
                        </div>

                        <div id="checkoutError" style="color: #dc3545; font-weight: bold;"></div>

                        <button type="submit" id="submitOrderBtn" class="btn btn-primary" style="padding: 15px; font-size: 1.1em; margin-top: 10px;">Place Order</button>
                    </form>
                </div>

                <!-- Summary Column -->
                <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; border: 1px solid #eee;">
                    <h3 style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Order Summary</h3>
                    
                    ${summaryHtml}
                    
                    <div style="border-top: 1px solid #ddd; margin-top: 15px; padding-top: 15px;">
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2em;">
                            <span>Subtotal:</span>
                            <span>Rs ${subtotal.toLocaleString()}</span>
                        </div>
                        <div style="font-size: 0.85em; color: #666; margin-top: 10px;">
                            Delivery charges will be calculated and applied to the final invoice by our team.
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Handle submission
        document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('submitOrderBtn');
            const errorDiv = document.getElementById('checkoutError');
            
            btn.textContent = 'Processing...';
            btn.disabled = true;
            errorDiv.textContent = '';

            const orderData = {
                customer_name: document.getElementById('custName').value,
                customer_phone: document.getElementById('custPhone').value,
                customer_email: document.getElementById('custEmail').value || undefined,
                delivery_city: document.getElementById('custCity').value,
                delivery_address: document.getElementById('custAddress').value,
                payment_method: document.getElementById('custPayment').value
            };

            try {
                const response = await api.orders.create(orderData);
                
                // Show Success Screen
                container.innerHTML = `
                    <div style="text-align: center; padding: 50px; background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" style="width: 80px; height: 80px; margin-bottom: 20px;">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h2 style="color: #28a745; margin-bottom: 10px;">Order Placed Successfully!</h2>
                        <p style="font-size: 1.2em; margin-bottom: 20px;">Your Order ID is: <strong>#${response.order_id}</strong></p>
                        <p style="color: #555; margin-bottom: 30px;">Thank you for choosing TBM Power. We will contact you shortly regarding delivery.</p>
                        <a href="index.html" class="btn btn-outline">Return to Home</a>
                    </div>
                `;

                // Optionally generate a new session ID if you want a clean cart immediately, 
                // but the backend `create` endpoint already clears the DB cart items for this session ID.

            } catch (error) {
                console.error('Checkout error:', error);
                errorDiv.textContent = error.detail || 'An error occurred during checkout. Please verify your information and try again.';
                btn.textContent = 'Place Order';
                btn.disabled = false;
            }
        });

    } catch (error) {
        console.error('Failed to load checkout summary', error);
        container.innerHTML = `<p class="error-text">Error loading checkout. Please try again later.</p>`;
    }
}
