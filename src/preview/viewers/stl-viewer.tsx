import { useMemo, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import * as THREE from 'three'

function StlModel({ geometry }: { geometry: THREE.BufferGeometry }) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#6b9bd2" metalness={0.3} roughness={0.6} />
    </mesh>
  )
}

export interface StlViewerProps {
  /** Raw STL file content as an ArrayBuffer */
  content: ArrayBuffer
  /** Background color of the 3D viewport (default: "#f5f5f5") */
  backgroundColor?: string
  /** Model color (default: "#6b9bd2") */
  modelColor?: string
  /** Additional CSS class */
  className?: string
}

export function StlViewer({ content, backgroundColor = '#f5f5f5', className = '' }: StlViewerProps) {
  const geometry = useMemo(() => {
    const loader = new STLLoader()
    const geom = loader.parse(content)
    geom.computeVertexNormals()
    geom.center()
    return geom
  }, [content])

  return (
    <div className={`h-full w-full ${className}`} style={{ background: backgroundColor }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          <Stage adjustCamera intensity={0.5} environment="city">
            <StlModel geometry={geometry} />
          </Stage>
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
    </div>
  )
}
