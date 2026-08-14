import { mock, type Mock } from 'bun:test'

export type VideoMock = {
  playbackRate: number
  paused: boolean
  duration: number
  currentTime: number
  play: Mock<() => Promise<void>>
  pause: Mock<() => void>
  tagName: string
}

export function createVideoMock(): VideoMock {
  return {
    playbackRate: 1.0,
    paused: false,
    duration: 30,
    currentTime: 0,
    play: mock(() => Promise.resolve()),
    pause: mock(() => {}),
    tagName: 'video'
  }
}
