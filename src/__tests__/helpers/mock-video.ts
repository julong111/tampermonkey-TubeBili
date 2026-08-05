import { mock, type Mock } from 'bun:test'

export type VideoMock = {
  playbackRate: number
  paused: boolean
  play: Mock<() => Promise<void>>
  pause: Mock<() => void>
  tagName: string
}

export function createVideoMock(): VideoMock {
  return {
    playbackRate: 1.0,
    paused: false,
    play: mock(() => Promise.resolve()),
    pause: mock(() => {}),
    tagName: 'video'
  }
}
