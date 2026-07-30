let allLeads = [];

document.addEventListener('DOMContentLoaded', () => {
    loadLeads();

    document.getElementById('leadsSearch').addEventListener('input', (e) => {
        renderLeads(filterLeads(e.target.value.trim().toLowerCase()));
    });
});

async function loadLeads() {
    const tbody = document.getElementById('leadsTableBody');
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Loading...</td></tr>`;

    try {
        allLeads = await api.admin.leads.list();
        renderLeads(allLeads);
    } catch (err) {
        console.error('Failed to load leads', err);
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:red;">Error loading leads. Check your session.</td></tr>`;
    }
}

function filterLeads(query) {
    if (!query) return allLeads;
    return allLeads.filter(lead =>
        (lead.full_name || '').toLowerCase().includes(query) ||
        (lead.phone || '').toLowerCase().includes(query) ||
        (lead.email || '').toLowerCase().includes(query)
    );
}

function renderLeads(leads) {
    const tbody = document.getElementById('leadsTableBody');
    const countEl = document.getElementById('leadsCount');

    countEl.textContent = `Showing ${leads.length} of ${allLeads.length} leads`;

    if (leads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No leads found.</td></tr>`;
        return;
    }

    tbody.innerHTML = leads.map((lead, index) => {
        const date = lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—';

        const sizingParts = [];
        if (lead.recommended_kw != null)   sizingParts.push(`${lead.recommended_kw} kW`);
        if (lead.panels_needed != null)    sizingParts.push(`${lead.panels_needed} panels`);
        if (lead.units_per_day != null)    sizingParts.push(`${lead.units_per_day} units/day`);
        if (lead.peak_sun_hours != null)   sizingParts.push(`${lead.peak_sun_hours}h sun`);
        const sizingText = sizingParts.length > 0 ? sizingParts.join(', ') : '—';

        const systemBadgeColor = { on_grid: '#2ecc71', off_grid: '#e67e22', hybrid: '#3498db' };
        const systemType = lead.system_type || 'unknown';
        const badgeColor = systemBadgeColor[systemType] || '#999';

        return `
            <tr>
                <td>${allLeads.indexOf(lead) + 1}</td>
                <td class="lead-detail-cell">${date}</td>
                <td><strong>${lead.full_name || '—'}</strong></td>
                <td class="lead-detail-cell">
                    ${lead.phone || '—'}<br>
                    ${lead.email ? `<a href="mailto:${lead.email}" style="color:#3498db;">${lead.email}</a>` : ''}
                </td>
                <td class="lead-detail-cell">
                    ${lead.city || '—'}<br>
                    <span style="color:#888;">${lead.region || ''}</span>
                </td>
                <td>
                    <span style="background:${badgeColor}; color:#fff; padding:3px 8px; border-radius:10px; font-size:0.8em;">
                        ${systemType.replace('_', '-').toUpperCase()}
                    </span>
                </td>
                <td class="lead-detail-cell">Rs ${lead.monthly_bill_range || '—'}</td>
                <td class="lead-detail-cell">${sizingText}</td>
            </tr>
        `;
    }).join('');
}
