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

function convertPointsToArrays(stroke, closed =true){
  // if (!points.length) return []

  // const commands = [['M', ...points[0]]] // Start with the 'Move' command

  // // Iterate through each point in the stroke to build 'Q' commands
  // for (let i = 0; i < points.length - 1; i++) {
  //   const [x0, y0] = points[i]
  //   const [x1, y1] = points[i + 1]
  //   const controlX = x0 // Using the current point as the control point
  //   const controlY = y0
  //   const endX = (x0 + x1) / 2 // The midpoint between the current and next point
  //   const endY = (y0 + y1) / 2

  //   // Add a 'Q' command for the quadratic curve
  //   commands.push(['Q', controlX, controlY, endX, endY])
  // }

  // // Close the path if it's not a line
  // if (points.length > 2) {
  //   commands.push(['Z']) // Close the path
  // }
  if (!stroke.length) return []

  const commands = [['M', ...stroke[0]]] // Start with the 'Move' command

  for (let i = 0; i < stroke.length ; i++) {
    const [x, y] = stroke[i]

    // Add an 'L' command for the line
    commands.push(['L', x, y])
  // //   // const [x0, y0] = stroke[i]
  // //   // const [x1, y1] = stroke[i + 1]
  // //   // const control1X = x0 // This simplistic approach uses the segment's endpoints as control points.
  // //   // const control1Y = y0 // You'd likely want a more sophisticated approach for real applications.
  // //   // const control2X = x1
  // //   // const control2Y = y1

  // //   // // Add a 'C' command for the cubic curve
  // //   // commands.push(['C', control1X, control1Y, control2X, control2Y, x1, y1])
  }

  // // Close the path if it's not a line
  if (stroke.length > 2) {
    commands.push(['Z']) // Close the path
  }

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
  simplifyPath: Boolean
) {
  // const stroke = getStroke(points,options)
  const pathArrays = convertPointsToArrays(
    simplifyPath ? simplify(points, 0.5) : points
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
