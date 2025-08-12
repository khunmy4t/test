(async () => {
  try {
    // Extract authenticity_token from inline onclick handlers
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
      console.log('authenticity_token not found!');
      return;
    }
    console.log('Found authenticity_token:', token);

    // Send POST request to delete account
    const response = await fetch('/account/destroy', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        '_method': 'delete',
        'authenticity_token': token
      }).toString(),
      redirect: 'follow'
    });

    if (response.ok) {
      console.log('Account deleted successfully!');
    } else {
      console.warn(`Failed to delete account. Status: ${response.status}`);
      console.log(await response.text());
    }
  } catch (err) {
    console.error('Error:', err);
  }
})();
