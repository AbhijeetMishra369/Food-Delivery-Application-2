import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'

const slides = [
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604908176997-431632bed5d8?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=2000&auto=format&fit=crop'
]

export function HeroCarousel() {
  return (
    <div className="w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        spaceBetween={16}
        slidesPerView={1}
        className="rounded-xl overflow-hidden shadow-md"
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="h-64 md:h-96 relative">
              <img src={src} alt="delicious" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white text-2xl font-semibold drop-shadow">
                Cravings delivered fast
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}