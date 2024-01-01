import { getStroke, type StrokeOptions } from 'perfect-freehand'
import simplify from './simplify'

export const options: StrokeOptions = {
  size: 4,
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t) => t,
  start: {
    taper: 0,
    easing: (t) => t,
    cap: true,
  },
  end: {
    taper: 0,
    easing: (t) => t,
    cap: true,
  },
}

const average = (a, b) => (a + b) / 2

function getSvgPathFromStroke(points, closed = true) {
  const len = points.length

  if (len < 4) {
    return ``
  }

  let a = points[0]
  let b = points[1]
  const c = points[2]

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i]
    b = points[i + 1]
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `
  }

  if (closed) {
    result += 'Z'
  }

  return result
}

function convertPointsToArrays(points, closed =true){
  const len = points.length

  if (len < 4) {
    return []
  }

  let result = []
  let a = points[0]
  let b = points[1]
  const c = points[2]

  // Start with the 'Move' command point
  result.push(['M', a[0].toFixed(2), a[1].toFixed(2)])

  // First quadratic Bézier curve
  result.push([
    'Q',
    b[0].toFixed(2),
    b[1].toFixed(2),
    average(b[0], c[0]).toFixed(2),
    average(b[1], c[1]).toFixed(2),
  ])

  // Following smooth/quadratic Bézier curves ('T')
  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i]
    b = points[i + 1]
    result.push([
      'T',
      average(a[0], b[0]).toFixed(2),
      average(a[1], b[1]).toFixed(2),
    ])
  }

  // If the path is closed, append a 'Z'
  if (closed) {
    result.push(['Z'])
  }

  return result
}

export function getSvgPathArraysfromPoints(
  points: Array<Array<number>>,
  options: StrokeOptions
){
  const stroke = getStroke(points,options)
  const pathArrays = convertPointsToArrays(stroke)
  return pathArrays
}
// export function getSvgPathFromStroke(stroke) {
//   if (!stroke.length) return ''

//   const d = stroke.reduce(
//     (acc, [x0, y0], i, arr) => {
//       const [x1, y1] = arr[(i + 1) % arr.length]
//       acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
//       return acc
//     },
//     ['M', ...stroke[0], 'Q']
//   )

//   d.push('Z')
//   return d.join(' ')
// }

export function getSmoothPathData(
  points: Array<Array<number>>,
  options: StrokeOptions,
  simplifyPath: Boolean = false
) {
  const stroke = getStroke(points, options)
  const pathData = getSvgPathFromStroke(
    simplifyPath ? simplify(stroke, 0.5) : stroke
  )
  return pathData
}
