const API_URL: string = 'http://localhost:8000';

export async function getTotal(): Promise<number> {
  const response = await fetch(`${API_URL}/vehicles/total`);

  if (!response.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  return Number(text);
}

export async function getPlates(): Promise<object> {
  const response = await fetch(`${API_URL}/vehicles/plates`);

  if (!response.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  return JSON.parse(text);
}