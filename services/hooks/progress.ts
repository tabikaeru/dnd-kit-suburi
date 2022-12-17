import { useRef, useCallback } from 'react'
import NProgress from 'nprogress'

const startPosition = 0.3 // プログレスの初期値
const stopDelayMs = 200 // プログレスをすぐに完了状態にしないようにするためのディレイ

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })

// MEMO: パスが違う場合のみプログレスバーを表示させる。
const isShowProgress = (prevURL: string, nextURL: string) => {
  const prevPath = prevURL.replace(/\?.*$/, '')
  const nextPath = nextURL.replace(/\?.*$/, '')
  return prevPath !== nextPath
}

export const useProgressHandlers = () => {
  const timer = useRef<NodeJS.Timeout | null>(null)
  const prevURL = useRef<string>('')

  const handleStartProgress = useCallback((url: string) => {
    const isShow = isShowProgress(prevURL.current, url)
    if (!isShow) {
      return
    }

    NProgress.set(startPosition)
    NProgress.start()
  }, [])

  const handleCompleteProgress = useCallback((url: string) => {
    const isShow = isShowProgress(prevURL.current, url)
    prevURL.current = url
    if (!isShow) {
      return
    }

    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      NProgress.done(true)
    }, stopDelayMs)
  }, [])

  return { handleStartProgress, handleCompleteProgress }
}
