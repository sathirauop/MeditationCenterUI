'use client';

import { useState, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Sortable Activity Block
function SortableActivityBlock({ activity, onRemove, onUpdate, showCancelled = false }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: activity.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-3 p-4 rounded-lg border bg-white shadow-sm",
                isDragging && "opacity-50 shadow-lg",
                activity.is_cancelled && "bg-red-50 border-red-200"
            )}
        >
            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            >
                <GripVertical className="w-5 h-5" />
            </button>

            {/* Time Range */}
            <div className="flex items-center gap-2 min-w-[200px]">
                <Clock className="w-4 h-4 text-teal-600" />
                <Input
                    type="time"
                    value={activity.start_time}
                    onChange={(e) => onUpdate({ ...activity, start_time: e.target.value })}
                    className="w-24 text-center"
                    disabled={activity.is_cancelled}
                />
                <span className="text-gray-400">→</span>
                <Input
                    type="time"
                    value={activity.end_time}
                    onChange={(e) => onUpdate({ ...activity, end_time: e.target.value })}
                    className="w-24 text-center"
                    disabled={activity.is_cancelled}
                />
            </div>

            {/* Activity Title */}
            <div className={cn(
                "flex-1 font-medium",
                activity.is_cancelled && "line-through text-gray-400"
            )}>
                {activity.activity_title || activity.title}
            </div>

            {/* Notes */}
            <Input
                placeholder="Notes (optional)"
                value={activity.notes || ''}
                onChange={(e) => onUpdate({ ...activity, notes: e.target.value })}
                className="w-48"
                disabled={activity.is_cancelled}
            />

            {/* Cancelled Checkbox (for overrides) */}
            {showCancelled && (
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={activity.is_cancelled || false}
                        onCheckedChange={(checked) => onUpdate({ ...activity, is_cancelled: checked })}
                    />
                    <span className={activity.is_cancelled ? "text-red-600" : "text-gray-500"}>
                        Cancel
                    </span>
                </label>
            )}

            {/* Remove Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(activity.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}

// Draggable Activity from Picker
function DraggableActivity({ activity, onAdd }) {
    return (
        <div
            onClick={() => onAdd(activity)}
            className="p-3 rounded-lg border bg-gray-50 hover:bg-teal-50 hover:border-teal-300 cursor-pointer transition-colors"
        >
            <div className="font-medium text-gray-900">{activity.title}</div>
            {activity.description && (
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{activity.description}</div>
            )}
        </div>
    );
}

// Main Timeline Editor Component
export default function TimelineEditor({
    activities = [],
    availableActivities = [],
    onChange,
    showCancelled = false,
    emptyMessage = "No activities scheduled. Add activities from the left panel."
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Filter available activities
    const filteredAvailable = useMemo(() => {
        return availableActivities.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [availableActivities, searchQuery]);

    // Sort activities by start_time
    const sortedActivities = useMemo(() => {
        return [...activities].sort((a, b) => {
            if (!a.start_time || !b.start_time) return 0;
            return a.start_time.localeCompare(b.start_time);
        });
    }, [activities]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const oldIndex = activities.findIndex(a => a.id === active.id);
            const newIndex = activities.findIndex(a => a.id === over.id);
            const newActivities = arrayMove(activities, oldIndex, newIndex);
            onChange(newActivities);
        }
    };

    const handleAddActivity = (masterActivity) => {
        const newActivity = {
            id: `new-${Date.now()}`,
            activity_id: masterActivity.activity_id,
            activity_title: masterActivity.title,
            start_time: '08:00',
            end_time: '09:00',
            notes: '',
            is_cancelled: false,
        };
        onChange([...activities, newActivity]);
    };

    const handleUpdateActivity = (updatedActivity) => {
        const newActivities = activities.map(a =>
            a.id === updatedActivity.id ? updatedActivity : a
        );
        onChange(newActivities);
    };

    const handleRemoveActivity = (id) => {
        onChange(activities.filter(a => a.id !== id));
    };

    const activeItem = activeId ? activities.find(a => a.id === activeId) : null;

    return (
        <div className="flex gap-6 h-[calc(100vh-300px)] min-h-[500px]">
            {/* Left Panel - Activity Picker */}
            <div className="w-72 flex flex-col bg-gray-50 rounded-lg border p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Available Activities</h3>
                <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-3"
                />
                <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredAvailable.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 text-sm">
                            No activities found
                        </div>
                    ) : (
                        filteredAvailable.map((activity) => (
                            <DraggableActivity
                                key={activity.activity_id}
                                activity={activity}
                                onAdd={handleAddActivity}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel - Timeline */}
            <div className="flex-1 flex flex-col bg-white rounded-lg border p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Scheduled Activities</h3>
                    <span className="text-sm text-gray-500">{activities.length} activities</span>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
                            <p className="text-center">{emptyMessage}</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={activities.map(a => a.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {sortedActivities.map((activity) => (
                                        <SortableActivityBlock
                                            key={activity.id}
                                            activity={activity}
                                            onRemove={handleRemoveActivity}
                                            onUpdate={handleUpdateActivity}
                                            showCancelled={showCancelled}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                            <DragOverlay>
                                {activeItem ? (
                                    <div className="p-4 rounded-lg border bg-teal-50 shadow-lg opacity-80">
                                        <span className="font-medium">{activeItem.activity_title}</span>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
}
