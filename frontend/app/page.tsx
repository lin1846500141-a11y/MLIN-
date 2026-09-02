import type { Metadata } from 'next'
import { HomeExperience } from '@/components/home/home-experience'

export const metadata: Metadata = {
  title: 'Coastal Signal Archive',
  description: 'MLINStudio 的海岸信号档案：界面、机器、实践与持续更新的记录。',
}

export default function HomePage() {
  return <HomeExperience />
}
