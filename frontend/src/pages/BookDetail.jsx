const fetchBookDetails = async () => {
  try {
    setLoading(true);
    const response = await fetch(`http://localhost:5000/books/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }

    const data = await response.json();
    setBook(data);
    await fetchReviews(); // Fetch reviews after book details
  } catch (err) {
    console.error('Error:', err);
    setError('Error loading book details');
  } finally {
    setLoading(false);
  }
};

// Modify your useEffect to not fetch reviews separately
useEffect(() => {
  if (id && token) {
    fetchBookDetails();
  }
}, [id, token]);