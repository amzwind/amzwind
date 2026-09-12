import { useFavorites, type FavoriteItemType } from '../contexts/FavoritesContext'

interface FavoriteButtonProps {
  id: string
  type: FavoriteItemType
  title: string
  price: number
  image_url?: string | null
  className?: string
  size?: 'sm' | 'md'
}

export default function FavoriteButton({ id, type, title, price, image_url, className = '', size = 'md' }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const active = isFavorite(id, type)

  const sizes = size === 'sm'
    ? 'w-8 h-8'
    : 'w-9 h-9'

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite({ id, type, title, price, image_url })
      }}
      className={`${sizes} rounded-full flex items-center justify-center transition-all duration-300 ${
        active
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
          : 'bg-white/80 dark:bg-black/40 text-gray-400 dark:text-white/40 hover:bg-white dark:hover:bg-black/60 hover:text-red-400 backdrop-blur-sm'
      } ${className}`}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <svg
        className={iconSize}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
