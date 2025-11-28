import Image from 'next/image';

/**
 * EventHero Component
 * Displays the hero section with cover image
 * 
 * @param {Object} event - Event data
 */
export default function EventHero({ event }) {
    const { cover_image_url, name } = event;

    return (
        <section className="relative pt-20 bg-white">
            {/* Hero Container with rounded image */}
            <div className="container mx-auto px-6 sm:px-10 py-8">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                    {/* Cover Image */}
                    {cover_image_url ? (
                        <Image
                            src={cover_image_url}
                            alt={name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-blue-900/5" />
                    )}
                </div>
            </div>
        </section>
    );
}
