import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, pageToken } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      // Return empty data if API key is not yet set instead of mock data
      console.warn("GOOGLE_MAPS_API_KEY is not set in .env.local. Returning empty places array.");
      return NextResponse.json({
        places: [],
        nextPageToken: null
      });
    }

    const url = 'https://places.googleapis.com/v1/places:searchText';
    
    const requestBody: any = {
      textQuery: query,
    };
    
    if (pageToken) {
      requestBody.pageToken = pageToken;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName.text,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location,places.photos,nextPageToken'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google API Error:", errorText);
      return NextResponse.json({ error: "Failed to fetch from Google API" }, { status: response.status });
    }

    const data = await response.json();

    // Map photoUrls using the API key (up to 4 photos)
    if (data.places) {
      data.places = data.places.map((place: any) => {
        const photoUrls: string[] = [];
        if (place.photos && place.photos.length > 0) {
          const maxPhotos = Math.min(place.photos.length, 4);
          for (let i = 0; i < maxPhotos; i++) {
            const photoName = place.photos[i].name;
            photoUrls.push(`https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=800&maxWidthPx=800&key=${apiKey}`);
          }
        }
        return { ...place, photoUrls };
      });
    }

    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
