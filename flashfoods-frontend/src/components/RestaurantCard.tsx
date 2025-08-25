import { Card, CardActionArea, CardContent, CardMedia, IconButton, Rating, Stack, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

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
    <Card className="rounded-xl shadow-sm hover:shadow-md transition">
      <CardActionArea>
        <div className="relative">
          <CardMedia component="img" height="160" image={image} alt={name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <IconButton size="small" className="!absolute top-2 right-2 bg-white/90">
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
          <div className="absolute bottom-2 left-3 text-white text-sm font-medium bg-black/40 px-2 py-0.5 rounded">
            {deliveryTimeMin}-{deliveryTimeMin + 10} mins
          </div>
        </div>
        <CardContent>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={600}>{name}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>{cuisine}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating name="read-only" size="small" value={rating} precision={0.1} readOnly />
              <Typography variant="caption" color="text.secondary">{rating.toFixed(1)}</Typography>
              <Typography variant="caption">•</Typography>
              <Typography variant="caption" color="text.secondary">{priceForTwo}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}