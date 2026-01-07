type CategoryName = 'form' | 'data' | 'navigation' | 'overlay' | 'page' | 'dashboard' | 'ai-chat' | 'editor' | 'content' | 'color-mode' | 'element'

interface CardItem {
  title: string
  desc: string
  imgUrl?: string
  to?: string
}
