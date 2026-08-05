import { main, cleanup } from './main.js'

window.addEventListener('beforeunload', cleanup)
main()
