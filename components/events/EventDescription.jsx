/**
 * EventDescription Component
 * Displays the event description
 * 
 * @param {Object} event - Event data
 */
export default function EventDescription({ event }) {
    const { description } = event;

    return (
        <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About This Event</h2>

            <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                    {description}
                </p>
            </div>
        </div>
    );
}
