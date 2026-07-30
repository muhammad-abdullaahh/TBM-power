document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('button[type="submit"]');
            const errorDiv = document.getElementById('contactError');
            const successBanner = document.getElementById('formSuccessBanner');
            
            btn.textContent = 'Sending...';
            btn.disabled = true;
            if (errorDiv) errorDiv.textContent = '';
            if (successBanner) successBanner.classList.remove('active');

            const leadData = {
                full_name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value || undefined,
                city: document.getElementById('city').value || undefined,
                region: document.getElementById('region').value,
                system_type: document.getElementById('system_type').value,
                monthly_bill_range: document.getElementById('monthly_bill').value
            };

            try {
                await api.leads.create(leadData);
                
                // Show Success
                if (successBanner) successBanner.classList.add('active');
                form.reset();
                
            } catch (error) {
                console.error('Failed to submit solar lead', error);
                if (errorDiv) {
                    errorDiv.textContent = error.detail || 'Failed to submit inquiry. Please check your details and try again.';
                } else {
                    alert(error.detail || 'Failed to submit inquiry.');
                }
            } finally {
                btn.innerHTML = `Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
                btn.disabled = false;
            }
        });
    }
});
