export async function getYouTubeStats(accessToken: string) {
  const channelRes = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  const channelData = await channelRes.json()

  if (!channelData.items || channelData.items.length === 0) return null

  const channel = channelData.items[0]
  const channelStats = {
    subscribers: parseInt(channel.statistics.subscriberCount || "0"),
    totalViews: parseInt(channel.statistics.viewCount || "0"),
    totalVideos: parseInt(channel.statistics.videoCount || "0"),
    channelTitle: channel.snippet?.title || "",
  }

  const videosRes = await fetch(
    "https://www.googleapis.com/youtube/v3/search?part=snippet&mine=true&type=video&maxResults=20&order=date",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  const videosData = await videosRes.json()

  if (!videosData.items || videosData.items.length === 0) {
    return { ...channelStats, videos: [], monthlyRevenue: 0 }
  }

  const videoIds = videosData.items.map((v: any) => v.id.videoId).join(",")

  const statsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  const statsData = await statsRes.json()

  const videos = statsData.items?.map((video: any) => {
    const duration = video.contentDetails?.duration || "PT0S"
    const seconds = parseDuration(duration)
    const isShort = seconds <= 60
    const views = parseInt(video.statistics?.viewCount || "0")
    const estimatedRevenue = calculateRevenue(views, isShort)

    return {
      id: video.id,
      title: video.snippet?.title || "",
      views,
      likes: parseInt(video.statistics?.likeCount || "0"),
      comments: parseInt(video.statistics?.commentCount || "0"),
      duration: seconds,
      isShort,
      publishedAt: video.snippet?.publishedAt || "",
      estimatedRevenue,
    }
  }) || []

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyRevenue = videos
    .filter((v: any) => {
      const date = new Date(v.publishedAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((sum: number, v: any) => sum + v.estimatedRevenue, 0)

  return { ...channelStats, videos, monthlyRevenue }
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || "0")
  const minutes = parseInt(match[2] || "0")
  const seconds = parseInt(match[3] || "0")
  return hours * 3600 + minutes * 60 + seconds
}

function calculateRevenue(views: number, isShort: boolean): number {
  const rpm = isShort ? 10 : 50
  return Math.round((views / 1000) * rpm)
}

export async function getYouTubeSubscribers(accessToken: string) {
  const stats = await getYouTubeStats(accessToken)
  if (!stats) return null
  return {
    subscribers: stats.subscribers,
    views: stats.totalViews,
    videos: stats.totalVideos,
    channelTitle: stats.channelTitle,
  }
}