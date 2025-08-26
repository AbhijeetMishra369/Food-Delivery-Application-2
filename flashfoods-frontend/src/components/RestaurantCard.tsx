import { Card, CardActionArea, CardContent, CardMedia, IconButton, Rating, Stack, Typography, Chip } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'

export type RestaurantCardProps = {
  name: string
  image: string
  cuisine: string
  rating: number
  deliveryTimeMin: number
  priceForTwo: string
}

export function RestaurantCard(props: RestaurantCardProps) {
  const { name, image, cuisine, rating, deliveryTimeMin, priceForTwo } = props
  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition animate-floatIn">
      <CardActionArea>
        <div className="relative">
          <CardMedia component="img" height="160" image={image} alt={name} className="transition-transform duration-300 hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <IconButton size="small" className="!absolute top-2 right-2 bg-white/90">
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
          <div className="absolute bottom-2 left-3 flex gap-2">
            <Chip size="small" color="success" label={`${rating.toFixed(1)} ★`} />
            <Chip size="small" icon={<AccessTimeIcon />} label={`${deliveryTimeMin}-${deliveryTimeMin + 10} mins`} />
            <Chip size="small" icon={<CurrencyRupeeIcon />} label={priceForTwo} />
          </div>
        </div>
        <CardContent>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={600}>{name}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>{cuisine}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating name="read-only" size="small" value={rating} precision={0.1} readOnly />
              <Typography variant="caption" color="text.secondary">{rating.toFixed(1)}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}