const API_URL: string = 'http://localhost:8000';


export async function insertPlate(plateObject: object) {
  const nextIDresponse = await fetch(`${API_URL}/vehicles/nextAvailableID`);
  const nextID = Number(await nextIDresponse.text());
  const discounts = await fetch(`${API_URL}/vehicles/discounts`);

  const discount = JSON.parse(await discounts.text());

  discount.map((disc:any) => {
    //console.log(disc.profileName);
    //console.log(plateObject)
    if (disc.profileName === (plateObject as any).discountID) {
      (plateObject as any).discountID = disc.discountID;
    }
  });

  //console.log(plateObject);

  plateObject = Object.assign({"plateID": nextID}, plateObject);
  
  
  fetch(`${API_URL}/vehicles/insert`, {
    method: "POST",
    body: JSON.stringify(plateObject),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  
}

export async function updatePlate(plateObject: object) {

  const discounts = await fetch(`${API_URL}/vehicles/discounts`);

  const discount = JSON.parse(await discounts.text());

  discount.map((disc:any) => {
    //console.log(disc.profileName);
    //console.log(plateObject)
    if (disc.profileName === (plateObject as any).discountID) {
      (plateObject as any).discountID = disc.discountID;
    }
  });

  //console.log(plateObject);

  
  fetch(`${API_URL}/vehicles/update`, {
    method: "POST",
    body: JSON.stringify(plateObject),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  
  
}

export async function insertDiscount(discountObject: object) {
  const nextIDresponse = await fetch(`${API_URL}/vehicles/nextAvailableDiscountID`);
  const nextID = Number(await nextIDresponse.text());

  discountObject = Object.assign({"discountID": nextID}, discountObject);

  fetch(`${API_URL}/vehicles/insertDiscount`, {
    method: "POST",
    body: JSON.stringify(discountObject),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
}

export async function updateDiscount(discountObject: object) {

  fetch(`${API_URL}/vehicles/updateDiscount`, {
    method: "POST",
    body: JSON.stringify(discountObject),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
}

export async function adjustPrice(newprice: number) {

  fetch(`${API_URL}/vehicles/updatePrice`, {
    method: "POST",
    body: JSON.stringify({"configValue": newprice}),
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

export async function getDiscounts(): Promise<object> {
  const response = await fetch(`${API_URL}/vehicles/discounts`);

  if (!response.ok) {
    throw new Error('it broke lol');
  }

  const text = await response.text();
  return JSON.parse(text);	
}

export async function getPlates(): Promise<object> {
  const response = await fetch(`${API_URL}/vehicles/plates`);
  const discounts = await fetch(`${API_URL}/vehicles/discounts`);

  if (!response.ok || !discounts.ok) {
    throw new Error('it broke lol');
  }

  var text = JSON.parse(await response.text());
  const discount = JSON.parse(await discounts.text());
  
  text?.map((plate:any) => {
    if(plate.discountID !== 0 && (plate.discountID in discount)) {
      plate.discountProfile = discount[plate.discountID-1].profileName;
      plate.discountPercent = discount[plate.discountID-1].discountPercent;
    } else {
      plate.discountProfile = "None";
      plate.discountPercent = 0
    }
  });
  return text;
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
      var discount = discountobj[plate.discountID-1];
      total += hourlyRate * (discount.discountPercent/100);
    } else {
      total = total + hourlyRate;
    }
  })

  //total = hourlyRate * Object.keys(obj).length;

  return total;
}