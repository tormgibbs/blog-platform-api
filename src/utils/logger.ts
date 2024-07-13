type Params = unknown[]

const info = (...params: Params) => {
  console.log(...params)
}


const error = (...params: Params) => {
  console.error(...params)
}

export default {
  info,
  error
}