import React, { useState } from 'react'
import { DragOverlay, DndContext, DragStartEvent, DragOverEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'

type NewumorphismRectangleProps = {
  value: string
}
const NewumorphismRectangle = ({ value }: NewumorphismRectangleProps) => {
  return (
    <div
      style={{
        width: 300,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50px',
        background: '#e0e0e0',
        boxShadow: '20px 20px 60px #bebebe,-20px -20px 60px #ffffff',
      }}
    >
      {value}
    </div>
  )
}

type ItemProps = {
  value: string
}
const Item = ({ value }: ItemProps) => (
  <div style={{ padding: 8 }}>
    <NewumorphismRectangle value={value}></NewumorphismRectangle>
  </div>
)

type SortableItemProps = {
  value: string
}

const SortableItem = ({ value }: SortableItemProps) => {
  const { attributes, listeners, transform, transition, setNodeRef } = useSortable({ id: value })

  return (
    <div ref={setNodeRef} style={{ padding: 8, transform: CSS.Transform.toString(transform), transition }} {...listeners} {...attributes}>
      <NewumorphismRectangle value={value}></NewumorphismRectangle>
    </div>
  )
}

const Page = () => {
  const [items, setItems] = useState(['1', '2', '3', '4', '5'])
  const [activeId, setActiveId] = useState(null)
  const findIndex = (id: string, items: string[]) => {
    return items.indexOf(id)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    const id = active.id.toString()
    const overId = over?.id as string
    if (!overId) return
    const activeIndex = findIndex(id, items)
    const overIndex = findIndex(overId, items)
    if (activeIndex === overIndex) return
    setItems((prev) => {
      const eliminatedArrays = [...prev.slice(0, activeIndex), ...prev.slice(activeIndex + 1, prev.length)]
      eliminatedArrays.splice(overIndex, 0, id)
      return eliminatedArrays
    })
  }

  const handleDragEnd = () => {
    setActiveId(null)
  }
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
        <DragOverlay
          dropAnimation={{
            duration: 500,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeId ? <Item value={`${activeId}`} /> : null}
        </DragOverlay>
        <SortableContext items={items}>
          {items.map((item) => (
            <SortableItem key={`aa-${item}`} value={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default Page
