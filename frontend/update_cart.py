import os
directory = r'c:\Users\MUHAMMAD ABDULLAH\OneDrive - Higher Education Commission\Desktop\TBM\frontend'

for file in ['cart.html', 'checkout.html']:
    filepath = os.path.join(directory, file)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tag = '<meta name="robots" content="noindex, follow">\n  <link rel="canonical" href="https://tbmpower.com.pk/' + file + '">'
    if 'noindex' not in content:
        content = content.replace('</head>', f'  {tag}\n</head>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
print("Updated cart and checkout")
