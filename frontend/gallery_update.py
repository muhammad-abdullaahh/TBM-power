import re

filepath = r'c:\Users\MUHAMMAD ABDULLAH\OneDrive - Higher Education Commission\Desktop\TBM\frontend\gallery.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Item 1
item1_old = '''          <div class="placeholder-box">
            <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <div class="placeholder-label">[Project Image Placeholder]</div>
            <div class="placeholder-subtext">Outdoor Switchyard 132kV</div>
          </div>'''
item1_new = '''          <div class="placeholder-box" style="padding: 0; border: none; background: transparent;">
            <img src="Images/Society Project/1.jpeg" alt="150kW solar panel installation rooftop - Gulshan-e-Maymar housing society, Karachi" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);">
            <div class="placeholder-label" style="display: none;">Outdoor Switchyard 132kV</div>
          </div>'''

# Item 2
item2_old = '''          <div class="placeholder-box">
            <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <div class="placeholder-label">[Project Image Placeholder]</div>
            <div class="placeholder-subtext">SCADA Telemetry Control Desk</div>
          </div>'''
item2_new = '''          <div class="placeholder-box" style="padding: 0; border: none; background: transparent;">
            <img src="Images/Industry project/2.jpeg" alt="SCADA telemetry control desk setup - Malir industrial facility" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);">
            <div class="placeholder-label" style="display: none;">SCADA Telemetry Control Desk</div>
          </div>'''

# Item 3
item3_old = '''          <div class="placeholder-box">
            <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <div class="placeholder-label">[Electrical Equipment Placeholder]</div>
            <div class="placeholder-subtext">Thermal Infrared Inspection</div>
          </div>'''
item3_new = '''          <div class="placeholder-box" style="padding: 0; border: none; background: transparent;">
            <img src="Images/Residential project/2.jpeg" alt="10kW residential solar installation - DHA Phase 6, Karachi" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);">
            <div class="placeholder-label" style="display: none;">Thermal Infrared Inspection</div>
          </div>'''

# Item 4
item4_old = '''          <div class="placeholder-box">
            <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <div class="placeholder-label">[Transformer Placeholder]</div>
            <div class="placeholder-subtext">Oil Cooling Radiator Bank</div>
          </div>'''
item4_new = '''          <div class="placeholder-box" style="padding: 0; border: none; background: transparent;">
            <img src="Images/Residential project 2/4.jpeg" alt="3kW residential solar installation - Korangi, Karachi" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);">
            <div class="placeholder-label" style="display: none;">Oil Cooling Radiator Bank</div>
          </div>'''

# Item 5
item5_old = '''          <div class="placeholder-box">
            <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <div class="placeholder-label">[Project Image Placeholder]</div>
            <div class="placeholder-subtext">SF6 Gas Insulated Switchgear</div>
          </div>'''
item5_new = '''          <div class="placeholder-box" style="padding: 0; border: none; background: transparent;">
            <img src="Images/Society Project2/3.jpeg" alt="Solar street lighting installation - Gulshan-e-Maymar housing society" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);">
            <div class="placeholder-label" style="display: none;">SF6 Gas Insulated Switchgear</div>
          </div>'''

# Item 6
item6_old = '''          <div class="placeholder-box">
            <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <div class="placeholder-label">[Team Image Placeholder]</div>
            <div class="placeholder-subtext">Engineers Calibrating Protection Relays</div>
          </div>'''
item6_new = '''          <div class="placeholder-box" style="padding: 0; border: none; background: transparent;">
            <img src="Images/Other projects/1.jpeg" alt="500kW industrial solar power system - Malir Industrial Area, Karachi" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);">
            <div class="placeholder-label" style="display: none;">Engineers Calibrating Protection Relays</div>
          </div>'''

# Replace all
content = content.replace(item1_old, item1_new)
content = content.replace(item2_old, item2_new)
content = content.replace(item3_old, item3_new)
content = content.replace(item4_old, item4_new)
content = content.replace(item5_old, item5_new)
content = content.replace(item6_old, item6_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated gallery placeholders")
