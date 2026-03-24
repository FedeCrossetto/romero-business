import { useState, useEffect } from 'react'

export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
  profile_photo_url: string
}

const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID as string | undefined
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined

function loadMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.maps) { resolve(); return }
    const existing = document.getElementById('gmaps-script')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      return
    }
    const script = document.createElement('script')
    script.id = 'gmaps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places&language=es&region=AR`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })
}

export function useGoogleReviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [rating, setRating] = useState<number | null>(null)
  const [totalRatings, setTotalRatings] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!PLACE_ID || !MAPS_KEY) {
      setLoading(false)
      return
    }

    const attrEl = document.createElement('div')

    loadMapsScript()
      .then(() => {
        const google = (window as any).google
        const service = new google.maps.places.PlacesService(attrEl)
        service.getDetails(
          { placeId: PLACE_ID, fields: ['reviews', 'rating', 'user_ratings_total'] },
          (place: any, status: string) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              setReviews(place.reviews ?? [])
              setRating(place.rating ?? null)
              setTotalRatings(place.user_ratings_total ?? null)
            }
            setLoading(false)
          },
        )
      })
      .catch(() => setLoading(false))
  }, [])

  return { reviews, rating, totalRatings, loading }
}
