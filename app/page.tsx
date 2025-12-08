import { Logo } from "@/components/icons"

import { FacebookLogoIcon, InstagramLogoIcon, XLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/ssr"

export default function Home() {
  return (
    <>
      <div className='flex flex-col gap-4  fixed top-0 left-0 right-0 bottom-0 z-50'>
        <div className='flex items-center justify-between px-12 py-4'>
          <Logo className='size-32' fill='var(--color-bricky-brick)' />
          <Logo className='size-16' fill='var(--color-bricky-brick)' />
        </div>
        <div className='flex flex-col gap-4'>
          <div className='font-primary text-2xl font-medium'>Daire Planı</div>
          <div className='font-primary text-2xl font-medium'>Ödeme Planı</div>
          <div className='font-primary text-2xl font-medium'>Masterplan</div>
          <div className='font-primary text-2xl font-medium'>City's Living</div>
          <div className='font-primary text-2xl font-medium'>Websitesi </div>
        </div>
        <div className='mr-auto mt-auto hidden gap-4 xl:flex'>
          <FacebookLogoIcon
            weight='fill'
            className='size-9 cursor-pointer text-bricky-brick transition-colors duration-300 hover:text-bricky-brick'
          />
          <InstagramLogoIcon
            weight='fill'
            className='size-9 cursor-pointer text-bricky-brick transition-colors duration-300 hover:text-bricky-brick'
          />
          <XLogoIcon
            weight='fill'
            className='size-9 cursor-pointer text-bricky-brick transition-colors duration-300 hover:text-bricky-brick'
          />
          <YoutubeLogoIcon
            weight='fill'
            className='size-9 cursor-pointer text-bricky-brick transition-colors duration-300 hover:text-bricky-brick'
          />
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='w-screen h-screen bg-amber-50'></div>
        <div className='w-screen h-screen bg-amber-100'></div>
        <div className='w-screen h-screen bg-amber-200'></div>
        <div className='w-screen h-screen bg-amber-300'></div>
        <div className='w-screen h-screen bg-amber-400'></div>
      </div>
    </>
  )
}
