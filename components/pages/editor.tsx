import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useDraggable, useDroppable, useDndContext, DragOverlay, DndContext, DragEndEvent, DragStartEvent, ClientRect } from '@dnd-kit/core'
import { createSnapModifier } from '@dnd-kit/modifiers'
import { Coordinates } from '@dnd-kit/utilities'
interface Artifact {
  id: string
  type: string
  style?: React.CSSProperties
  text?: string
  coordinates?: Coordinates
}

type CreateArtifact = Omit<Artifact, 'id'>

const ARTBORD_ID = 'droppable-artbord-id'
const SIDE_BAR_WIDTH = 300
const ARTBORD_WIDTH = 1000
const ARTBORD_HEIGHT = 600
const GRID_SIZE = 10

const NEWMOR_RECTANGLE: Artifact = {
  id: 'newmor-ractangle-ingredinent-id',
  type: 'newmor-ractangle',
  style: {
    width: 200,
    height: 100,
  },
  text: null,
  coordinates: null,
}

const NEWMOR_HOLE: Artifact = {
  id: 'newmor-hole-ingredinent-id',
  type: 'newmor-hole',
  style: {
    width: 100,
    height: 100,
  },
  text: null,
  coordinates: null,
}
const INGREDIENT_IDS = [NEWMOR_RECTANGLE.id, NEWMOR_HOLE.id]

const INGREDIENT_ARTIFACT_DICTIONARY: { [id: string]: Artifact } = {
  [NEWMOR_RECTANGLE.id]: NEWMOR_RECTANGLE,
  [NEWMOR_HOLE.id]: NEWMOR_HOLE,
}

const deNormalizeCoordinates = (coordinates: Coordinates, artbordSize: DOMRect) => ({
  x: coordinates.x * artbordSize.width,
  y: coordinates.y * artbordSize.height,
})

type NewumorRectangleProps = {
  artifact: Artifact
}
const NewumorRectangle = ({ artifact }: NewumorRectangleProps) => {
  return (
    <div
      id={artifact?.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50px',
        background: '#e0e0e0',
        boxShadow: '20px 20px 60px #bebebe,-20px -20px 60px #ffffff',
        ...artifact?.style,
      }}
    >
      {artifact?.text}
    </div>
  )
}

type NewumorHoleProps = {
  artifact: Artifact
}
const NewumorHole = ({ artifact }: NewumorHoleProps) => {
  return (
    <div
      id={artifact?.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50px',
        background: 'linear-gradient(145deg, #cacaca, #f0f0f0)',
        boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
        ...artifact?.style,
      }}
    >
      {artifact?.text}
    </div>
  )
}

type DroppableArtifactProps = {
  artifact: Artifact
  isActive: boolean
}

const DroppableArtifact = ({ artifact, isActive }: DroppableArtifactProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: artifact.id,
  })
  const targetArtifact: Artifact = {
    ...artifact,
    style: {
      ...artifact.style,
      opacity: isActive ? 0.5 : 1,
    },
  }
  return (
    <div id={targetArtifact.id} ref={setNodeRef} style={{ padding: 8 }} {...listeners} {...attributes}>
      <>{artifactByArtifact(targetArtifact)}</>
    </div>
  )
}

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
    id: ARTBORD_ID,
  })

  return (
    <div
      id={ARTBORD_ID}
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

const artifactByArtifact = (artifact: Artifact) => {
  switch (artifact.type) {
    case NEWMOR_RECTANGLE.type:
      return <NewumorRectangle artifact={artifact} />
    case NEWMOR_HOLE.type:
      return <NewumorHole artifact={artifact} />
    default:
      throw new Error('No matching artifact found')
  }
}

type DraggingArtifactProps = {
  artifact: Artifact
  activeArtifactStartCoordinate: Coordinates
  artbordSize: DOMRect
}
const DraggingArtifact = ({ artifact, activeArtifactStartCoordinate, artbordSize }: DraggingArtifactProps) => {
  const isFromLeftPanel = !INGREDIENT_ARTIFACT_DICTIONARY[artifact?.id]
  if (isFromLeftPanel) {
    artifact.style = {
      ...artifact?.style,
      position: 'absolute',
      top: activeArtifactStartCoordinate.y - artbordSize.top,
      left: activeArtifactStartCoordinate.x - artbordSize.left,
    }
  }
  return <>{artifactByArtifact(artifact)}</>
}

type DraggableArtifactProps = {
  artifact: Artifact
  artbordSize?: DOMRect
}
const DraggableArtifact = ({ artifact, artbordSize }: DraggableArtifactProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: artifact.id,
  })

  const deNormalizedCoordinates = deNormalizeCoordinates(artifact?.coordinates, artbordSize)
  const targetArtifact: Artifact = {
    ...artifact,
    style: {
      ...artifact?.style,
      position: 'absolute',
      top: deNormalizedCoordinates.y,
      left: deNormalizedCoordinates.x,
    },
  }
  return (
    <div id={artifact.id} ref={setNodeRef} {...listeners} {...attributes}>
      {artifactByArtifact(targetArtifact)}
    </div>
  )
}

const isPlacableArtifactOnArtbord = (overId: string, artifactCoordinate: Coordinates, activeArtifact: Artifact, rect: ClientRect) =>
  !overId ||
  artifactCoordinate.x - rect.left < 0 ||
  artifactCoordinate.y - rect.top < 0 ||
  artifactCoordinate.x - rect.right + Number(activeArtifact.style.width) > 0 ||
  artifactCoordinate.y - rect.bottom + Number(activeArtifact.style.height) > 0

const Page = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [activeId, setActiveId] = useState<string>(null)
  const [activeArtifactStartCoordinate, setActiveArtifactStartCoordinate] = useState<Coordinates>({ x: null, y: null })
  const [myDocument, setMyDocument] = useState<Document>()

  useEffect(() => {
    setMyDocument(document)
  }, [])

  const artbordSize: DOMRect | null | undefined = useMemo(() => {
    if (!myDocument) return null
    return myDocument.getElementById(ARTBORD_ID)?.getBoundingClientRect()
  }, [myDocument])

  const findArtifact = useCallback(
    (activeId: string) => {
      if (INGREDIENT_ARTIFACT_DICTIONARY[activeId]) return INGREDIENT_ARTIFACT_DICTIONARY[activeId]
      return artifacts.find((artifact) => artifact.id === activeId)
    },
    [artifacts]
  )
  const activeArtifact: Artifact = useMemo(() => {
    const targetArtifact: Artifact = findArtifact(activeId)
    if (!artbordSize || !targetArtifact) return

    const isFromArtbord = !INGREDIENT_ARTIFACT_DICTIONARY[targetArtifact?.id]
    if (isFromArtbord && targetArtifact.coordinates) {
      const deNormalizedArtifactFirstCoordinatesFromArtbordStartPoint = deNormalizeCoordinates(targetArtifact.coordinates, artbordSize)
      const deNormalizedArtifactFirstCoordinatesFromBrowserStartPoint = {
        x: deNormalizedArtifactFirstCoordinatesFromArtbordStartPoint.x + artbordSize.left,
        y: deNormalizedArtifactFirstCoordinatesFromArtbordStartPoint.y + artbordSize.top,
      }
      setActiveArtifactStartCoordinate(deNormalizedArtifactFirstCoordinatesFromBrowserStartPoint)
    }

    return {
      coordinates: targetArtifact?.coordinates,
      id: targetArtifact?.id,
      type: targetArtifact?.type,
      style: targetArtifact?.style,
      text: targetArtifact?.text,
    }
  }, [findArtifact, activeId, artbordSize])

  const resetDndState = () => {
    setActiveId(null)
  }

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString())
    const targetElement = document.getElementById(event.active.id.toString())?.getBoundingClientRect()
    setActiveArtifactStartCoordinate({ x: targetElement?.x, y: targetElement?.y })
  }
  const onDragEnd = useCallback(
    ({ over, delta }: DragEndEvent) => {
      const activeArtifactCoordinate: Coordinates = {
        x: activeArtifactStartCoordinate.x + delta.x,
        y: activeArtifactStartCoordinate.y + delta.y,
      }
      if (isPlacableArtifactOnArtbord(over?.id.toString(), activeArtifactCoordinate, activeArtifact, over?.rect)) {
        resetDndState()
        return
      }
      const relativeArtifactCoordinates: Coordinates = {
        x: (activeArtifactCoordinate.x - over.rect.left) / over.rect.width,
        y: (activeArtifactCoordinate.y - over.rect.top) / over.rect.height,
      }

      const newArtifact: CreateArtifact = {
        type: activeArtifact.type,
        coordinates: {
          x: relativeArtifactCoordinates.x,
          y: relativeArtifactCoordinates.y,
        },
        style: activeArtifact.style,
        text: activeArtifact.text,
      }
      setArtifacts((prev) => {
        const isFromArtbord = !!prev.find((data) => data.id === activeId)
        if (isFromArtbord) {
          return prev.map((data) => (data.id === activeId ? { id: activeId, ...newArtifact } : data))
        }
        return [
          {
            id: `artifact- ${Math.random().toString()}`,
            ...JSON.parse(JSON.stringify(newArtifact)),
          },
          ...prev,
        ]
      })
      setTimeout(() => resetDndState(), 1)
    },
    [activeArtifact, activeArtifactStartCoordinate, activeId]
  )

  const onDragCancel = () => {
    resetDndState()
  }

  const snapToGrid = useMemo(() => createSnapModifier(GRID_SIZE), [])
  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel} modifiers={[snapToGrid]}>
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
          }}
        >
          {INGREDIENT_IDS.map((id) => (
            <DroppableArtifact key={id} artifact={INGREDIENT_ARTIFACT_DICTIONARY[id]} isActive={activeId === id} />
          ))}
        </div>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DroppableArtbord>
            {artifacts?.map((artifact) => artifact.id !== activeId && <DraggableArtifact key={artifact.id} artifact={artifact} artbordSize={artbordSize} />)}
          </DroppableArtbord>
        </div>
      </div>
      <DraggingArtifactOverlay isActive={!!activeId}>
        {activeArtifact && (
          <DraggingArtifact artifact={activeArtifact} activeArtifactStartCoordinate={activeArtifactStartCoordinate} artbordSize={artbordSize} />
        )}
      </DraggingArtifactOverlay>
    </DndContext>
  )
}

export default Page
