(async () => {
  try {
    // 1. Find authenticity_token from inline onclick handlers (like your example)
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

    // 2. Set the list ID to delete
    const listId = 2356146;  // change this if needed

    // 3. Prepare form data
    const formData = new URLSearchParams();
    formData.append('_method', 'delete');
    formData.append('authenticity_token', token);

    // 4. Send the POST request with fetch including credentials (cookies)
    const response = await fetch(`/lists/${listId}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString(),
      redirect: 'follow'
    });

    if (response.ok) {
      console.log(`List ${listId} deleted successfully!`);
    } else {
      console.warn(`Failed to delete list. Status: ${response.status}`);
      const text = await response.text();
      console.log('Response:', text.slice(0, 500));
    }
  } catch (err) {
    console.error('Error:', err);
  }
})();
