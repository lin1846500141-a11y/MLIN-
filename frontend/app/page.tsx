import type { Metadata } from 'next'
import { HomeExperience } from '@/components/home/home-experience'

export const metadata: Metadata = {
  title: 'Coastal Digital Archive',
}

export default function HomePage() {
  return <HomeExperience />
}
