const API_URL: string = 'http://localhost:8000';


export async function insertPlate(plateObject: object) {
  const nextIDresponse = await fetch(`${API_URL}/vehicles/nextAvailableID`);
  const nextID = Number(await nextIDresponse.text());

  plateObject = Object.assign({"plateID": nextID}, plateObject);

  fetch(`${API_URL}/vehicles/insert`, {
    method: "POST",
    body: JSON.stringify(plateObject),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
}

export async function deletePlate(licensePlate: string) {

  var plateObject = {"licensePlate": licensePlate}

  fetch(`${API_URL}/vehicles/remove`, {
    method: "POST",
    body: JSON.stringify(plateObject),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
}

export async function getTotal(): Promise<number> {
  const response = await fetch(`${API_URL}/vehicles/total`);

  if (!response.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  return Number(text);
}


export async function getActiveTotal(): Promise<number> {
  const response = await fetch(`${API_URL}/vehicles/activeTotal`);

  if (!response.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  return Number(text);
}

export async function getActivePlates(): Promise<object> {
  const response = await fetch(`${API_URL}/vehicles/activePlates`);

  if (!response.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  return JSON.parse(text);
}

export async function getInactivePlates(): Promise<object> {
  const response = await fetch(`${API_URL}/vehicles/inactivePlates`);

  if (!response.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  return JSON.parse(text);
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

export async function getRecentEntries(): Promise<object> {
  const response = await fetch(`${API_URL}/vehicles/recentEntries`);

  if (!response.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  return JSON.parse(text);
}

export async function getRecentExits(): Promise<object> {
  const response = await fetch(`${API_URL}/vehicles/recentExits`);

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
  const response = await fetch(`${API_URL}/vehicles/activePlates`);
  const rateresponse = await fetch(`${API_URL}/vehicles/rates`);
  const discountresponse = await fetch(`${API_URL}/vehicles/discounts`);

  if (!response.ok || !rateresponse.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  const rates = await rateresponse.text();
  const discounts = await discountresponse.text();

  const obj = JSON.parse(text);
  const rateobj = JSON.parse(rates);
  const discountobj = JSON.parse(discounts);

  var total = 0;

  var hourlyRate = 0;

  rateobj?.map((rate: any) => {
    if(rate.configKey === "hourly_rate") {
        hourlyRate = Number(rate.configValue);
    }
  });
  
  obj.map((plate: any) => {
    
    if(plate.discountID in discountobj) {
      var discount = discountobj[plate.discountID];
      total += hourlyRate * (discount.discountPercent/100);
    } else {
      total = total + hourlyRate;
    }
  })

  //total = hourlyRate * Object.keys(obj).length;

  return total;
}