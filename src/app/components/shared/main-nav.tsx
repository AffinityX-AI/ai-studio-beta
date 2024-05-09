'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChatBubble,
  MagicWand,
  OneFingerSelectHandGesture,
  Post,
  RssFeedTag,
  SearchWindow,
} from 'iconoir-react'

import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    label: (
      <div className='flex items-center justify-center gap-2 pb-3 text-sm'>
        <OneFingerSelectHandGesture /> One Touch
      </div>
    ),
    key: 'one-touch',
  },
  {
    label: (
      <div className='flex items-center justify-center gap-2 pb-3 text-sm'>
        <ChatBubble /> Ask/Engage
      </div>
    ),
    key: 'ask-engage',
  },
  {
    label: (
      <div className='flex items-center justify-center gap-2 pb-3 text-sm'>
        <Post /> Blog Post Generator
      </div>
    ),
    key: 'blog-post-generator',
  },
  {
    label: (
      <div className='flex items-center justify-center gap-2 pb-3 text-sm'>
        <RssFeedTag /> Social Post Generator
      </div>
    ),
    key: 'social-post-generator',
  },
  {
    label: (
      <div className='flex items-center justify-center gap-2 pb-3 text-sm'>
        <SearchWindow /> SEO Copilot
      </div>
    ),
    key: 'seo-copilot',
  },
  {
    label: (
      <div className='flex items-center justify-center gap-2 pb-3 text-sm'>
        <MagicWand /> Wordpress Theme Builder
      </div>
    ),
    key: 'wordpress-theme-builder',
  },
]

export function MainNav() {
  const [current, setCurrent] = useState('one-touch')
  const router = useRouter()
  const pathname = usePathname()

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)

    switch (e.key) {
      case 'one-touch':
        router.push('/apps/one-touch')
        break
      case 'ask-engage':
        window.location.href = '/apps/ask-engage'
        break
      case 'blog-post-generator':
        window.location.href = '/apps/blog-post-generator'
        break
      case 'social-post-generator':
        window.location.href = '/apps/social-post-generator'
        break
      case 'seo-copilot':
        router.push('/apps/seo-copilot')
        break
      case 'wordpress-theme-builder':
        router.push('/apps/wordpress-theme-builder')
        break
      default:
        break
    }
  }

  useEffect(() => {
    console.log('pathname', pathname)
    const currentKey = pathname.split('/')?.reverse()?.[0]
    console.log('currentKey', currentKey)
    setCurrent(currentKey)
  }, [pathname])

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode='horizontal'
      items={items}
      className='flex items-center justify-center w-full !border-none'
    />
  )
}
