"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

type ImageItem = { src: string; alt?: string }

type CardCarouselProps = {
  images: ImageItem[]
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
  heightClass?: string
  itemClass?: string
}

export function CardCarousel({
  images,
  autoplayDelay = 0,
  showPagination = false,
  showNavigation = false,
  heightClass = "h-72 md:h-96",
  itemClass = "basis-full md:basis-1/2 lg:basis-1/3 pl-6 md:pl-10",
}: CardCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api || !autoplayDelay) return
    const id = setInterval(() => {
      api.scrollNext()
    }, autoplayDelay)
    return () => clearInterval(id)
  }, [api, autoplayDelay])

  return (
    <div className="relative w-full h-full px-4 md:px-6">
      <Carousel opts={{ loop: true, align: "center" }} setApi={setApi}>
        <CarouselContent>
          {images.map((image, idx) => (
            <CarouselItem key={idx} className={itemClass}>
              <Card className="border-emerald-100 rounded-[32px] overflow-hidden bg-card shadow-md">
                <CardContent className="p-4 md:p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt || `Slide ${idx + 1}`}
                    className={`w-full ${heightClass} object-cover rounded-[24px]`}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {showNavigation ? (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        ) : null}
      </Carousel>

      {showPagination && api ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api.scrollTo(i)}
              className={
                "h-2 w-2 rounded-full transition-colors " +
                (selectedIndex === i ? "bg-primary" : "bg-muted")
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}


