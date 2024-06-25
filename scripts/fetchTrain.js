export default async function fetchTrain(origin, destination) {
  try {
    const response1 = await fetch(
      `https://api1.raildata.org.uk/1010-live-departure-board-dep/LDBWS/api/20220120/GetDepBoardWithDetails/${origin}?filterCRS=${destination}`,
      {
        headers: {
          'x-apikey': process.env.EXPO_PUBLIC_APIKEY,
        },
      }
    );
    const response2 = await fetch(
      `https://api1.raildata.org.uk/1010-live-departure-board-dep/LDBWS/api/20220120/GetDepBoardWithDetails/${destination}?filterCRS=${origin}`,
      {
        headers: {
          'x-apikey': process.env.EXPO_PUBLIC_APIKEY,
        },
      }
    );
    if (!response1.ok) {
      throw new Error('Network response was not ok ' + response1.statusText);
    }
    if (!response2.ok) {
      throw new Error('Network response was not ok ' + response2.statusText);
    }
    const data1 = await response1.json();
    const data2 = await response2.json();

    return { response: [data1, data2] };
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return null;
  }
}
