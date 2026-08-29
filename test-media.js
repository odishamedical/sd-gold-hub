const apiKey = 'AIzaSyDaDGYrNJkyswlqG8H0ySwWxfT0yxaGzFc';
const query = 'IRA Jewels Sambalpur';

async function run() {
  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.photos'
      },
      body: JSON.stringify({textQuery: query})
    });
    const data = await res.json();
    if (!data.places || !data.places[0] || !data.places[0].photos) {
      console.log('No photos found');
      return;
    }
    const photoName = data.places[0].photos[0].name;
    console.log('Found photo name:', photoName);

    const mediaUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=800&maxWidthPx=800&key=${apiKey}`;
    console.log('Fetching media URL:', mediaUrl);

    // Fetch without headers
    const mediaRes = await fetch(mediaUrl);
    console.log('Status without headers:', mediaRes.status);
    console.log('URL after redirect:', mediaRes.url);

    // Fetch with referer
    const mediaRes2 = await fetch(mediaUrl, {
      headers: {
        'Referer': 'https://golddunia.com/'
      }
    });
    console.log('Status with referer:', mediaRes2.status);

  } catch (e) {
    console.error(e);
  }
}
run();
