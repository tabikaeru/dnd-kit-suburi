import React, { useState, useMemo, useCallback } from 'react'
import { useDraggable, useDroppable, useDndContext, DragOverlay, DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { createSnapModifier } from '@dnd-kit/modifiers'
import { Coordinates } from '@dnd-kit/utilities'
type Artifact = {
  id: string
  x: number
  y: number
}

const NEWMOR_RECTANGLE_INGREDIENT_ID = 'newmor-ractangle-ingredinent-id'
const NEWMOR_RECTANGLE_DEFAULT_WIDTH = 200
const NEWMOR_RECTANGLE_DEFAULT_HEIGHT = 100
const SIDE_BAR_WIDTH = 300
const ARTBORD_WIDTH = 1000
const ARTBORD_HEIGHT = 600
const GRID_SIZE = 10

const calcX = (x: number) => x * ARTBORD_WIDTH
const calcY = (y: number) => y * ARTBORD_HEIGHT

type NewumorRectangleProps = {
  style?: React.CSSProperties
  value?: string
}
const NewumorRectangle = ({ value, style }: NewumorRectangleProps) => {
  return (
    <div
      style={{
        width: NEWMOR_RECTANGLE_DEFAULT_WIDTH,
        height: NEWMOR_RECTANGLE_DEFAULT_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50px',
        background: '#e0e0e0',
        boxShadow: '20px 20px 60px #bebebe,-20px -20px 60px #ffffff',
        ...style,
      }}
    >
      {value}
    </div>
  )
}

type DroppableNewumorRectangleProps = {
  id?: string
  style?: React.CSSProperties
  onSetActiveId: (id: string) => void
}

const DroppableNewumorRectangle = ({ id, style, onSetActiveId }: DroppableNewumorRectangleProps) => {
  onSetActiveId(id)
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  })
  return (
    <div id={id} ref={setNodeRef} style={{ ...style }} {...listeners} {...attributes}>
      <NewumorRectangle />
    </div>
  )
}

const iconsByKind = {
  [NEWMOR_RECTANGLE_INGREDIENT_ID]: <NewumorRectangle />,
}
type DraggingArtifactType = {
  id: string
}
const DraggingArtifact = ({ id }: DraggingArtifactType) => <>{iconsByKind[id]}</>

type DraggingArtifactOverlayProps = { isActive: boolean; children: React.ReactNode }
const DraggingArtifactOverlay = ({ isActive, children }: DraggingArtifactOverlayProps) => {
  const dndContext = useDndContext()
  const animation = {
    duration: 500,
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
  }
  const nonAnimation = {
    duration: 0,
  }
  return <DragOverlay dropAnimation={isActive ? nonAnimation : animation}>{dndContext?.active ? children : null}</DragOverlay>
}

type DroppableArtbordType = {
  children: React.ReactNode
}
const DroppableArtbord = ({ children }: DroppableArtbordType) => {
  const { setNodeRef } = useDroppable({
    id: 'droppable-artbord',
  })

  return (
    <div
      ref={(element: HTMLElement) => {
        setNodeRef(element)
      }}
      style={{
        width: ARTBORD_WIDTH,
        height: ARTBORD_HEIGHT,
        position: 'relative',
        background: '#e0e0e0',
        boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
        borderRadius: '8px',
      }}
    >
      {children}
    </div>
  )
}

const Page = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [isActive, setIsActive] = useState<boolean>(false)
  const [activeId, setActiveId] = useState<string>(null)
  const [activeIngredientPos, setActiveIngredientPos] = useState<Coordinates>({ x: null, y: null })

  const onSetActiveId = useCallback((id: string) => {
    setActiveId(id)
  }, [])
  const handleDragStart = (event: DragStartEvent) => {
    event
    console.log('activeId', activeId)
    const targetElement = document.getElementById(activeId)?.getBoundingClientRect()
    console.log('targetElement', targetElement)
    setActiveIngredientPos({ x: targetElement?.x, y: targetElement?.y })
    setIsActive(true)
  }
  const handleDragEnd = ({ over, delta }: DragEndEvent) => {
    if (
      !over?.id ||
      delta.x - over.rect.left < 0 ||
      delta.y - over.rect.top < 0 ||
      delta.x + NEWMOR_RECTANGLE_DEFAULT_WIDTH - over.rect.right > 0 ||
      delta.y + NEWMOR_RECTANGLE_DEFAULT_HEIGHT - over.rect.bottom > 0
    ) {
      setIsActive(false)
      return
    }
    const relativeArtifactPos = {
      x: (delta.x - over.rect.left + activeIngredientPos.x) / over.rect.width,
      y: (delta.y - over.rect.top + activeIngredientPos.y) / over.rect.height,
    }

    const newArtifact: Artifact = {
      x: relativeArtifactPos.x,
      y: relativeArtifactPos.y,
      id: (delta.x + delta.y).toString(),
    }
    setArtifacts((prev) => [...prev, newArtifact])
    setTimeout(() => setIsActive(false), 1)
  }
  const snapToGrid = useMemo(() => createSnapModifier(GRID_SIZE), [])
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[snapToGrid]}>
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        <div
          style={{
            width: SIDE_BAR_WIDTH,
            height: '100%',
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
            background: '#e0e0e0',
            flexShrink: 0,
            boxShadow: '-5px 5px 10px #bebebe, 5px -5px 10px #ffffff',
            padding: 32,
          }}
        >
          {!isActive && <DroppableNewumorRectangle id={NEWMOR_RECTANGLE_INGREDIENT_ID} onSetActiveId={onSetActiveId} />}
        </div>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DroppableArtbord>
            {artifacts?.map((artifact) => (
              <NewumorRectangle
                key={artifact.id}
                style={{
                  position: 'absolute',
                  top: calcY(artifact.y),
                  left: calcX(artifact.x),
                }}
              />
            ))}
          </DroppableArtbord>
        </div>
      </div>
      <DraggingArtifactOverlay isActive={isActive}>
        <DraggingArtifact id={activeId} />
      </DraggingArtifactOverlay>
    </DndContext>
  )
}

export default Page
