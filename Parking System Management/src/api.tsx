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

export async function getDiscountPlates(): Promise<object> {
  const response = await fetch(`${API_URL}/vehicles/discountedPlates`);

  if (!response.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  return JSON.parse(text);
}

export async function getPlate(license_plate: string): Promise<object> {
    const response = await fetch(`${API_URL}/vehicles/plates?license_plate=${license_plate}`);

    if(!response.ok) {
        throw new Error('plate not found');
    }

    const text = await response.text();
    return JSON.parse(text);
}

export async function getHourlyValue(): Promise<number> {
  const response = await fetch(`${API_URL}/vehicles/plates`);
  const rateresponse = await fetch(`${API_URL}/vehicles/rates`);

  if (!response.ok || !rateresponse.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  const rates = await rateresponse.text();


  const obj = JSON.parse(text);
  const rateobj = JSON.parse(rates);

  var total = 0;

  var hourlyRate = 0;

  obj?.map((plate: any) => {
    if(plate.exitTime !== 'null') {
        delete obj[plate.id]
    }
  });

  rateobj?.map((rate: any) => {
    if(rate.configKey === "hourly_rate") {
        hourlyRate = rate.configValue;
    }
  });

  total = hourlyRate * Object.keys(obj).length;

  return Number(total);
}