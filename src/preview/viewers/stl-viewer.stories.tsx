import { useState, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StlViewer } from './stl-viewer'

const meta: Meta<typeof StlViewer> = {
  title: 'Components/Viewers/StlViewer',
  component: StlViewer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A standalone 3D STL file viewer built on three.js and @react-three/fiber. Accepts raw STL file content as an ArrayBuffer. Supports orbit controls (rotate, zoom, pan) out of the box.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Generates a simple binary STL cube for demo purposes.
 */
function generateCubeStl(): ArrayBuffer {
  const vertices = [
    // Front face
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
    // Back face
    [1, -1, -1],
    [-1, -1, -1],
    [-1, 1, -1],
    [1, -1, -1],
    [-1, 1, -1],
    [1, 1, -1],
    // Top face
    [-1, 1, 1],
    [1, 1, 1],
    [1, 1, -1],
    [-1, 1, 1],
    [1, 1, -1],
    [-1, 1, -1],
    // Bottom face
    [-1, -1, -1],
    [1, -1, -1],
    [1, -1, 1],
    [-1, -1, -1],
    [1, -1, 1],
    [-1, -1, 1],
    // Right face
    [1, -1, 1],
    [1, -1, -1],
    [1, 1, -1],
    [1, -1, 1],
    [1, 1, -1],
    [1, 1, 1],
    // Left face
    [-1, -1, -1],
    [-1, -1, 1],
    [-1, 1, 1],
    [-1, -1, -1],
    [-1, 1, 1],
    [-1, 1, -1],
  ]

  const numTriangles = vertices.length / 3
  // Binary STL: 80-byte header + 4-byte triangle count + (50 bytes per triangle)
  const bufferSize = 80 + 4 + numTriangles * 50
  const buffer = new ArrayBuffer(bufferSize)
  const view = new DataView(buffer)

  // Skip 80-byte header (zeros)
  // Write triangle count
  view.setUint32(80, numTriangles, true)

  let offset = 84
  for (let i = 0; i < vertices.length; i += 3) {
    const v0 = vertices[i]
    const v1 = vertices[i + 1]
    const v2 = vertices[i + 2]

    // Compute face normal (cross product)
    const e1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]]
    const e2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]]
    const nx = e1[1] * e2[2] - e1[2] * e2[1]
    const ny = e1[2] * e2[0] - e1[0] * e2[2]
    const nz = e1[0] * e2[1] - e1[1] * e2[0]
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1

    // Normal
    view.setFloat32(offset, nx / len, true)
    offset += 4
    view.setFloat32(offset, ny / len, true)
    offset += 4
    view.setFloat32(offset, nz / len, true)
    offset += 4

    // Vertex 1
    view.setFloat32(offset, v0[0], true)
    offset += 4
    view.setFloat32(offset, v0[1], true)
    offset += 4
    view.setFloat32(offset, v0[2], true)
    offset += 4

    // Vertex 2
    view.setFloat32(offset, v1[0], true)
    offset += 4
    view.setFloat32(offset, v1[1], true)
    offset += 4
    view.setFloat32(offset, v1[2], true)
    offset += 4

    // Vertex 3
    view.setFloat32(offset, v2[0], true)
    offset += 4
    view.setFloat32(offset, v2[1], true)
    offset += 4
    view.setFloat32(offset, v2[2], true)
    offset += 4

    // Attribute byte count
    view.setUint16(offset, 0, true)
    offset += 2
  }

  return buffer
}

function StlViewerWithData() {
  const [data, setData] = useState<ArrayBuffer | null>(null)

  useEffect(() => {
    setData(generateCubeStl())
  }, [])

  if (!data) return <div>Generating STL...</div>

  return <StlViewer content={data} />
}

export const Cube: Story = {
  render: () => (
    <div style={{ height: '500px', width: '100%' }}>
      <StlViewerWithData />
    </div>
  ),
}
