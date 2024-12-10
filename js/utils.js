async function getData() {
  const url = "https://fakestoreapi.com/products";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;

  } catch (error) {
    console.error(error.message);
  }
}

export { getData }
