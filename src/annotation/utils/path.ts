import { getStroke, type StrokeOptions } from 'perfect-freehand'
import simplify from './simplify'

export const options: StrokeOptions = {
  size: 4,
  thinning: 0.3,
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
  if (!points.length) return []

  const commands = [['M', ...points[0]]] // Start with the 'Move' command

  // Iterate through each point in the stroke to build 'Q' commands
  for (let i = 1; i < points.length - 2; i++) {
    const p0 = points[i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2]

    // Calculate control points based on Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6

    commands.push(['C', cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]])
  }

  // Close the path if it's not a line
  if (points.length > 2) {
    commands.push(['Z']) // Close the path
  }
  // if (!stroke.length) return []

  // const commands = [['M', ...stroke[0]]] // Start with the 'Move' command

  // for (let i = 0; i < stroke.length - 1; i++) {
  //   const [x0, y0] = stroke[i]
  //   const [x1, y1] = stroke[i + 1]
  //   const control1X = x0 // This simplistic approach uses the segment's endpoints as control points.
  //   const control1Y = y0 // You'd likely want a more sophisticated approach for real applications.
  //   const control2X = x1
  //   const control2Y = y1

  //   // Add a 'C' command for the cubic curve
  //   commands.push(['C', control1X, control1Y, control2X, control2Y, x1, y1])
  // }

  // // Close the path if it's not a line
  // if (stroke.length > 2) {
  //   commands.push(['Z']) // Close the path
  // }

  return commands

  // return commands
  // const len = points.length

  // if (len < 4) {
  //   return []
  // }

  // let result = []
  // let a = points[0]
  // let b = points[1]
  // const c = points[2]

  // // Start with the 'Move' command point
  // result.push(['M', a[0].toFixed(2), a[1].toFixed(2)])

  // // First quadratic Bézier curve
  // result.push([
  //   'Q',
  //   b[0].toFixed(2),
  //   b[1].toFixed(2),
  //   average(b[0], c[0]).toFixed(2),
  //   average(b[1], c[1]).toFixed(2),
  // ])

  // // Following smooth/quadratic Bézier curves ('T')
  // for (let i = 2, max = len - 1; i < max; i++) {
  //   a = points[i]
  //   b = points[i + 1]
  //   result.push([
  //     'T',
  //     average(a[0], b[0]).toFixed(2),
  //     average(a[1], b[1]).toFixed(2),
  //   ])
  // }

  // // If the path is closed, append a 'Z'
  // if (closed) {
  //   result.push(['Z'])
  // }

  // return result
}

export function getSvgPathArraysfromPoints(
  points: Array<Array<number>>,
  options: StrokeOptions,
  simplifyPath : Boolean
){
  const stroke = getStroke(points,options)
  const pathArrays = convertPointsToArrays(
    simplifyPath ? simplify(stroke, 0.5) : stroke
  )
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
