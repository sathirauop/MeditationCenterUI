import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQ() {
    return (
        <section id="faq" className="py-20 bg-background">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground text-lg">
                        Find answers to common questions about our meditation programs and center.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg text-left">What should I wear for meditation?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            We recommend wearing loose, comfortable clothing that allows you to sit easily on a cushion or chair. White or light-colored clothing is traditional but not mandatory. Please avoid revealing attire out of respect for the monastic environment.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg text-left">Do I need prior experience to join?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            Not at all! We welcome beginners and experienced practitioners alike. Our programs are designed to guide you through the basics of mindfulness and meditation, regardless of your experience level.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg text-left">Is there a cost for the programs?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            Most of our daily meditation sessions are offered free of charge, supported by donations (Dana). Some special retreats or workshops may have a fee to cover food and accommodation costs, but we offer scholarships for those in need.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-lg text-left">Can I stay overnight at the center?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            Yes, we have accommodation facilities for retreat participants. Overnight stays must be booked in advance as part of a scheduled retreat program. Please contact us for availability and booking details.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-lg text-left">What types of meditation do you teach?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            We primarily teach Vipassana (Insight) and Samatha (Tranquility) meditation, rooted in the Theravada Buddhist tradition. We also offer Metta (Loving-Kindness) meditation sessions to cultivate compassion.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    )
}
